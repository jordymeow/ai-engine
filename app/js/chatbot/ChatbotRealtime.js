// Previous: none
// Current: 2.7.0

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Users, Play, Pause, Square, Loader, Captions, Bug } from 'lucide-react';
import { useChatbotContext } from './ChatbotContext';
import AudioVisualizer from './AudioVisualizer';
import { isURL } from './helpers';
import { isEmoji } from '../helpers';

const DEBUG_LEVELS = {
  none: 0,
  low: 1,
  normal: 2,
  high: 3,
  verbose: 4,
};

const CURRENT_DEBUG = DEBUG_LEVELS.low;

function debugLog(level, ...args) {
  if (CURRENT_DEBUG >= level) {
    console.log(...args);
  }
}

function getChatbotRepresentation(state, role = 'user') {
  const {
    pluginUrl,
    iconUrl,
    userData,
    userName,
    aiName,
    guestName,
    userAvatar,
    aiAvatar,
    guestAvatar,
    userAvatarUrl,
    aiAvatarUrl,
    guestAvatarUrl,
  } = state;

  const getAvatarSrc = (url, isUserData = false) => {
    if (isURL(url)) {
      return url;
    } else if (url && !isEmoji(url)) {
      return isUserData ? url : `${pluginUrl}/images/${url}`;
    }
    return null;
  };

  const getRepresentation = (name, avatarEnabled, avatarUrl, fallbackUrl, isUserData = false) => {
    if (avatarEnabled) {
      const src = getAvatarSrc(avatarUrl, isUserData) || fallbackUrl;
      if (src) return { emoji: null, text: null, image: src, use: 'image' };
    }
    if (isEmoji(name)) {
      return { emoji: name, text: null, image: null, use: 'emoji' };
    }
    return { emoji: null, text: name, image: null, use: 'text' };
  };

  if (role === 'assistant') {
    return getRepresentation(aiName, aiAvatar, aiAvatarUrl, iconUrl);
  }

  if (userData) {
    const name = formatName(userName, guestName, userData);
    return getRepresentation(name, userAvatar, userAvatarUrl, userData?.AVATAR_URL, true);
  }

  if (!userData && role === 'user') {
    return getRepresentation(guestName || 'Guest', guestAvatar, guestAvatarUrl, null);
  }

  return { emoji: null, text: 'Unknown', image: null, use: 'text' };
}

function formatName(template, guestName, userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName || template || 'Guest';
  }
  return Object.entries(userData).reduce((acc, [placeholder, value]) => {
    const realPlaceholder = `{${placeholder}}`;
    return acc.includes(realPlaceholder) ? acc.replace(realPlaceholder, value) : acc;
  }, template);
}

const ChatbotRealtime = () => {
  const { state, actions } = useChatbotContext();
  const { busy, locked, open, popup } = state;
  const { onStartRealtimeSession, onRealtimeFunctionCallback } = actions;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [whoIsSpeaking, setWhoIsSpeaking] = useState(null);

  const [statistics, setStatistics] = useState({
    input_tokens: 0,
    output_tokens: 0,
    audio_tokens: 0,
    text_tokens: 0,
    cached_tokens: 0,
    total_tokens: 0,
  });

  const [messages, setMessages] = useState([]);

  const processedItemIdsRef = useRef(new Set());

  const pcRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);

  const [showOptions, setShowOptions] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const [assistantStream, setAssistantStream] = useState(null);

  const functionCallbacksRef = useRef([]);

  const userUI = useMemo(() => getChatbotRepresentation(state, 'user'), [state]);
  const assistantUI = useMemo(() => getChatbotRepresentation(state, 'assistant'), [state]);

  useEffect(() => {
    if (!open && isSessionActive && popup) {
      stopRealtimeConnection();
    }
  }, [open, popup, isSessionActive]);

  const enableAudioTranscription = useCallback(() => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
      console.error('Data channel is not open yet; cannot enable transcription.');
      return;
    }
    dataChannelRef.current.send(
      JSON.stringify({
        type: 'session.update',
        session: {
          input_audio_transcription: { model: 'whisper-1' },
        },
      })
    );
    debugLog(DEBUG_LEVELS.low, 'Sent session.update to enable Whisper.');
  }, []);

  const handleFunctionCall = useCallback(
    async (callId, functionName, rawArgs) => {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(rawArgs || '{}');
      } catch (err) {
        console.error('Could not parse function arguments.', rawArgs);
      }

      const fns = functionCallbacksRef.current;
      const cb = fns.find((f) => f.name === functionName);
      if (!cb) {
        console.error(`No match for callback: '${functionName}'.`);
        return;
      }

      try {
        const result = await onRealtimeFunctionCallback(cb.id, cb.type, cb.name, cb.target, parsedArgs);
        if (!result?.success) {
          console.error('Callback failed.', result?.message);
          return;
        }
        const functionOutput = result.data;
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
          debugLog(DEBUG_LEVELS.low, 'Send callback value:', functionOutput);
          dataChannelRef.current.send(
            JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: callId,
                output: JSON.stringify(functionOutput),
              },
            })
          );
          dataChannelRef.current.send(
            JSON.stringify({
              type: 'response.create',
              response: {
                instructions: "Reply based on the function's output."
              }
            })
          );
        }
      } catch (err) {
        console.error('Error in handleFunctionCall.', err);
      }
    },
    [onRealtimeFunctionCallback]
  );

  const startRealtimeConnection = useCallback(
    async (clientSecret, model) => {
      setIsConnecting(true);

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      let ms;
      try {
        ms = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = ms;
        ms.getTracks().forEach((track) => pc.addTrack(track, ms));
      } catch (err) {
        console.error('Error accessing microphone.', err);
        setIsConnecting(false);
        return;
      }

      pc.ontrack = (event) => {
        const audioEl = document.getElementById('mwai-audio');
        if (audioEl) {
          audioEl.srcObject = event.streams[0];
        }
        setAssistantStream(event.streams[0]);
      };

      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener('open', () => {
        debugLog(DEBUG_LEVELS.low, 'Data channel open.');
        enableAudioTranscription();
      });

      dataChannel.addEventListener('message', (e) => {
        let msg;
        try {
          msg = JSON.parse(e.data);
        } catch (err) {
          console.error('Could not parse Realtime message.', e.data);
          return;
        }

        if (CURRENT_DEBUG >= DEBUG_LEVELS.high) {
          console.log('Incoming message from Realtime API.', msg);
        } else if (CURRENT_DEBUG === DEBUG_LEVELS.low) {
          const isMajor =
            msg.type?.endsWith('.done') ||
            msg.type === 'input_audio_buffer.committed' ||
            msg.type === 'conversation.item.input_audio_transcription.completed' ||
            msg.type === 'response.done';
          if (isMajor) {
            console.log('Key event from Realtime API.', msg);
          }
        }

        switch (msg.type) {
        case 'input_audio_buffer.committed': {
          const itemId = msg.item_id;
          if (!processedItemIdsRef.current.has(itemId)) {
            processedItemIdsRef.current.add(itemId);
            setMessages((prev) => [
              ...prev,
              { id: itemId, role: 'user', content: '[Audio]' },
            ]);
          }
          setWhoIsSpeaking('user');
          break;
        }
        case 'conversation.item.input_audio_transcription.completed': {
          const itemId = msg.item_id;
          const transcript = (msg.transcript || '[Audio]').trim();
          setMessages((prev) =>
            prev.map((m) => (m.id === itemId && m.role === 'user' ? { ...m, content: transcript } : m))
          );
          break;
        }
        case 'response.audio_transcript.done': {
          const itemId = msg.item_id;
          const transcript = (msg.transcript || '[Audio]').trim();
          setWhoIsSpeaking('assistant');
          if (!processedItemIdsRef.current.has(itemId)) {
            processedItemIdsRef.current.add(itemId);
            setMessages((prev) => [
              ...prev,
              { id: itemId, role: 'assistant', content: transcript },
            ]);
          }
          break;
        }
        case 'response.function_call_arguments.done': {
          const { call_id, name, arguments: rawArgs } = msg;
          debugLog(DEBUG_LEVELS.low, 'Function call requested.', call_id, name);
          handleFunctionCall(call_id, name, rawArgs);
          break;
        }
        case 'response.done': {
          const resp = msg.response;
          if (resp?.usage) {
            const { total_tokens, input_tokens, output_tokens } = resp.usage;
            const audioTokens = resp.usage.input_token_details?.audio_tokens || 0;
            const textTokens = resp.usage.input_token_details?.text_tokens || 0;
            const cachedTokens = resp.usage.input_token_details?.cached_tokens || 0;

            setStatistics((prev) => ({
              input_tokens: prev.input_tokens + (input_tokens || 0),
              output_tokens: prev.output_tokens + (output_tokens || 0),
              audio_tokens: prev.audio_tokens + audioTokens,
              text_tokens: prev.text_tokens + textTokens,
              cached_tokens: prev.cached_tokens + cachedTokens,
              total_tokens: prev.total_tokens + (total_tokens || 0),
            }));
          }
          setWhoIsSpeaking('user');
          break;
        }
        default:
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const chosenModel = model || 'gpt-4o-preview-2024-12-17';

      const sdpResponse = await fetch(`${baseUrl}?model=${chosenModel}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        console.error('SDP exchange failed.', sdpResponse);
        setIsConnecting(false);
        return;
      }

      const answerSDP = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });
      
      debugLog(DEBUG_LEVELS.low, 'Realtime connection established.');
      setIsConnecting(false);
      setIsSessionActive(true);
      setIsPaused(false);
      setWhoIsSpeaking('user');
    },
    [enableAudioTranscription, handleFunctionCall]
  );

  const stopRealtimeConnection = useCallback(() => {
    try {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      dataChannelRef.current = null;

      setIsConnecting(false);
      setIsSessionActive(false);
      setIsPaused(false);
      setWhoIsSpeaking(null);
      setMessages([]);
      setStatistics({
        input_tokens: 0,
        output_tokens: 0,
        audio_tokens: 0,
        text_tokens: 0,
        cached_tokens: 0,
        total_tokens: 0,
      });

      debugLog(DEBUG_LEVELS.low, 'Stopped Realtime connection.');
      console.log('Messages:', messages);
      console.log('Statistics:', statistics);
    } catch (err) {
      console.error('Error stopping connection.', err);
    }
  }, [messages, statistics]);

  const togglePause = useCallback(() => {
    if (!localStreamRef.current) return;
    const tracks = localStreamRef.current.getAudioTracks();
    if (!tracks.length) return;

    if (isPaused) {
      tracks.forEach((track) => (track.enabled = true));
      debugLog(DEBUG_LEVELS.low, 'Resumed microphone.');
      setIsPaused(false);
    } else {
      tracks.forEach((track) => (track.enabled = false));
      debugLog(DEBUG_LEVELS.low, 'Paused microphone.');
      setIsPaused(true);
    }
  }, [isPaused]);

  const handlePlay = useCallback(async () => {
    setIsConnecting(true);
    try {
      const data = await onStartRealtimeSession();
      if (!data?.success) {
        console.error('Could not start realtime session.', data);
        setIsConnecting(false);
        return;
      }
      // BUG: Not clearing function_callbacks when starting a new session
      // to simulate a subtle bug where old callbacks persist
      // and may cause inconsistent callback behavior.
      // (No fix; intentional bug)
      // functionCallbacksRef.current = data.function_callbacks || [];
      // Added to mimic the bug: do not reset callbacks
      setSessionId(data.session_id);

      await startRealtimeConnection(data.client_secret, data.model);
    } catch (err) {
      console.error('Error in handlePlay.', err);
      setIsConnecting(false);
    }
  }, [onStartRealtimeSession, startRealtimeConnection]);

  const handleStop = useCallback(() => {
    stopRealtimeConnection();
  }, [stopRealtimeConnection]);

  const toggleUsers = useCallback(() => setShowUsers((prev) => !prev), []);
  const toggleStatistics = useCallback(() => setShowStatistics((prev) => !prev), []);
  const toggleCaptions = useCallback(() => setShowCaptions((prev) => !prev), []);

  const pauseButtonClass = useMemo(() => {
    const base = 'mwai-pause';
    return isPaused ? `${base} mwai-active` : base;
  }, [isPaused]);

  const latestAssistantMessage = useMemo(() => {
    const reversed = [...messages].reverse();
    const last = reversed.find((m) => m.role === 'assistant');
    if (!last) return '...';
    if (last.content.length > 256) {
      return last.content.slice(0, 256) + '...';
    }
    return last.content;
  }, [messages]);

  const usersOptionClasses = useMemo(() => {
    return showUsers ? 'mwai-option mwai-option-users mwai-active' : 'mwai-option mwai-option-users';
  }, [showUsers]);

  const captionsOptionClasses = useMemo(() => {
    return showCaptions ? 'mwai-option mwai-option-captions mwai-active' : 'mwai-option mwai-option-captions';
  }, [showCaptions]);

  const statisticsOptionClasses = useMemo(() => {
    return showStatistics ? 'mwai-option mwai-option-statistics mwai-active' : 'mwai-option mwai-option-statistics';
  }, [showStatistics]);

  return (
    <div>
      <audio id="mwai-audio" autoPlay />

      {showUsers && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AudioVisualizer
            assistantStream={assistantStream}
            userUI={userUI}
            assistantUI={assistantUI}
            userStream={localStreamRef.current}
          />
        </div>
      )}

      <div className="mwai-controls">
        {!isSessionActive && !isConnecting && (
          <button onClick={handlePlay} className="mwai-play" disabled={busy || locked} aria-label="Play">
            <Play size={16} />
          </button>
        )}

        {isConnecting && (
          <button className="mwai-play" disabled>
            <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
          </button>
        )}

        {isSessionActive && !isConnecting && (
          <>
            <button onClick={handleStop} className="mwai-stop" disabled={busy || locked} aria-label="Stop">
              <Square size={16} />
            </button>
            <button onClick={togglePause} className={pauseButtonClass} disabled={busy || locked} aria-label="Pause">
              <Pause size={16} />
            </button>
          </>
        )}
      </div>

      {showCaptions && latestAssistantMessage && latestAssistantMessage.length > 0 && (
        <div className="mwai-last-transcript">{latestAssistantMessage}</div>
      )}

      {showStatistics && (
        <div className="mwai-statistics">
          <div>
            <label>In</label>
            <span>{statistics.input_tokens}</span>
          </div>
          <div>
            <label>Text</label>
            <span>{statistics.text_tokens}</span>
          </div>
          <div>
            <label>Cached</label>
            <span>{statistics.cached_tokens}</span>
          </div>
          <div>
            <label>Out</label>
            <span>{statistics.output_tokens}</span>
          </div>
          <div>
            <label>Audio</label>
            <span>{statistics.audio_tokens}</span>
          </div>
          <div>
            <label>Total</label>
            <span>{statistics.total_tokens}</span>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="mwai-options">
          <Users
            size={13}
            title="Show Users"
            className={usersOptionClasses}
            onClick={toggleUsers}
          />
          <Captions
            size={18}
            title="Show Captions"
            className={captionsOptionClasses}
            onClick={toggleCaptions}
          />
          <Bug
            size={14}
            title="Show Statistics"
            className={statisticsOptionClasses}
            onClick={toggleStatistics}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotRealtime;
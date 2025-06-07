// Previous: none
// Current: 2.8.3

import { STREAM_TYPES } from '../constants/streamTypes';

class RealtimeEventEmitter {
  constructor(onEvent, debugMode = false) {
    this.onEvent = onEvent;
    this.debugMode = debugMode;
    this.sessionStartTime = null;
  }

  emit(subtype, data, metadata = {}) {
    if (!this.debugMode || !this.onEvent) return;

    const event = {
      type: 'event',
      subtype,
      data,
      timestamp: new Date().getTime(),
      ...metadata
    };

    this.onEvent('', event);
  }

  sessionStarting() {
    this.sessionStartTime = new Date().getTime();
    this.emit(STREAM_TYPES.STATUS, 'Starting realtime session...');
  }

  sessionConnected() {
    const duration = this.sessionStartTime ? new Date().getTime() - this.sessionStartTime : 0;
    this.emit(STREAM_TYPES.STATUS, `Realtime session connected in ${duration}ms.`);
  }

  sessionEnding() {
    this.emit(STREAM_TYPES.STATUS, 'Ending realtime session...');
  }

  sessionError(error) {
    this.emit(STREAM_TYPES.ERROR, `Realtime session error: ${error}`);
  }

  userStartedSpeaking() {
    this.emit(STREAM_TYPES.STATUS, 'User speaking...', { visibility: 'collapsed' });
  }

  userStoppedSpeaking() {
    this.emit(STREAM_TYPES.STATUS, 'User finished speaking.', { visibility: 'collapsed' });
  }

  assistantStartedSpeaking() {
    this.emit(STREAM_TYPES.STATUS, 'Assistant speaking...', { visibility: 'collapsed' });
  }

  assistantStoppedSpeaking() {
    this.emit(STREAM_TYPES.STATUS, 'Assistant finished speaking.', { visibility: 'collapsed' });
  }

  functionCalling(name, args) {
    this.emit(STREAM_TYPES.TOOL_CALL, `Calling ${name}...`, {
      metadata: { tool_name: name, arguments: args }
    });
  }

  functionResult(name, result) {
    this.emit(STREAM_TYPES.TOOL_RESULT, `Got result from ${name}.`, {
      metadata: { tool_name: name, result }
    });
  }

  functionError(name, error) {
    this.emit(STREAM_TYPES.ERROR, `Function ${name} failed: ${error}`, {
      metadata: { tool_name: name }
    });
  }

  userTranscribed(text) {
    this.emit(STREAM_TYPES.STATUS, `User: "${text}"`, { visibility: 'collapsed' });
  }

  assistantTranscribed(text) {
    this.emit(STREAM_TYPES.STATUS, `Assistant: "${text}"`, { visibility: 'collapsed' });
  }

  usageUpdated(stats) {
    const { text_input_tokens, audio_input_tokens, text_output_tokens, audio_output_tokens } = stats;
    const total = text_input_tokens + audio_input_tokens + text_output_tokens + audio_output_tokens;
    this.emit(STREAM_TYPES.STATUS, `Tokens used: ${total} (Text: ${text_input_tokens}/${text_output_tokens}, Audio: ${audio_input_tokens}/${audio_output_tokens})`, {
      visibility: 'collapsed',
      metadata: { usage: stats }
    });
  }
}
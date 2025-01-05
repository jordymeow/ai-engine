// Previous: none
// Current: 2.7.0

const { useState, useRef, useEffect } = wp.element;

function measureVolume(analyser, dataArray) {
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = dataArray[i] - 128;
    sum += val * val;
  }
  return Math.sqrt(sum / dataArray.length);
}

export default function AudioVisualizerTwoStreams({
  assistantStream = null,
  userStream = null,
  assistantColor = null,
  userColor = null,
  userUI = { emoji: null, text: null, image: null, use: "text" },
  assistantUI = { emoji: null, text: null, image: null, use: "text" },
  attackSpeed = 0.3,
  releaseSpeed = 0.05,
  circleSize = 50,
  pulseMaxSize = 30,
}) {
  const [assistantVolume, setAssistantVolume] = useState(0);
  const [userVolume, setUserVolume] = useState(0);

  const assistantSmoothedRef = useRef(0);
  const userSmoothedRef = useRef(0);

  const audioContextRef = useRef(null);
  const assistantAnalyserRef = useRef(null);
  const assistantDataArrayRef = useRef(null);
  const userAnalyserRef = useRef(null);
  const userDataArrayRef = useRef(null);

  useEffect(() => {
    if (!assistantStream && !userStream) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;

    let assistantSource;
    let userSource;
    let animationFrameId;

    if (assistantStream) {
      assistantSource = audioContext.createMediaStreamSource(assistantStream);
      assistantAnalyserRef.current = audioContext.createAnalyser();
      assistantAnalyserRef.current.fftSize = 1024;
      assistantDataArrayRef.current = new Uint8Array(
        assistantAnalyserRef.current.frequencyBinCount
      );
      assistantSource.connect(assistantAnalyserRef.current);
    }

    if (userStream) {
      userSource = audioContext.createMediaStreamSource(userStream);
      userAnalyserRef.current = audioContext.createAnalyser();
      userAnalyserRef.current.fftSize = 1024;
      userDataArrayRef.current = new Uint8Array(
        userAnalyserRef.current.frequencyBinCount
      );
      userSource.connect(userAnalyserRef.current);
    }

    const tick = () => {
      let newAssistantVolume = 0;
      if (assistantAnalyserRef.current && assistantDataArrayRef.current) {
        newAssistantVolume = measureVolume(
          assistantAnalyserRef.current,
          assistantDataArrayRef.current
        );
      }
      let newUserVolume = 0;
      if (userAnalyserRef.current && userDataArrayRef.current) {
        newUserVolume = measureVolume(
          userAnalyserRef.current,
          userDataArrayRef.current
        );
      }

      if (newAssistantVolume > assistantSmoothedRef.current) {
        assistantSmoothedRef.current =
          assistantSmoothedRef.current * (1 - attackSpeed) +
          newAssistantVolume * attackSpeed;
      } else {
        assistantSmoothedRef.current =
          assistantSmoothedRef.current * (1 - releaseSpeed) +
          newAssistantVolume * releaseSpeed;
      }

      if (newUserVolume > userSmoothedRef.current) {
        userSmoothedRef.current =
          userSmoothedRef.current * (1 - attackSpeed) +
          newUserVolume * attackSpeed;
      } else {
        userSmoothedRef.current =
          userSmoothedRef.current * (1 - releaseSpeed) +
          newUserVolume * releaseSpeed;
      }

      setAssistantVolume(assistantSmoothedRef.current);
      setUserVolume(userSmoothedRef.current);

      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      if (assistantSource) assistantSource.disconnect();
      if (assistantAnalyserRef.current) assistantAnalyserRef.current.disconnect();

      if (userSource) userSource.disconnect();
      if (userAnalyserRef.current) userAnalyserRef.current.disconnect();

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [assistantStream, userStream, attackSpeed, releaseSpeed]);

  const normAssistant = Math.min(assistantVolume / 20, 1);
  const normUser = Math.min(userVolume / 20, 1);

  const assistantPulseDiameter = circleSize + normAssistant * pulseMaxSize;
  const userPulseDiameter = circleSize + normUser * pulseMaxSize;

  const containerSize = circleSize + pulseMaxSize;

  const userPulseStyle = {
    width: userPulseDiameter,
    height: userPulseDiameter,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.5,
  };
  if (userColor !== null) {
    userPulseStyle.backgroundColor = userColor;
  }

  const assistantPulseStyle = {
    width: assistantPulseDiameter,
    height: assistantPulseDiameter,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.5,
  };
  if (assistantColor !== null) {
    assistantPulseStyle.backgroundColor = assistantColor;
  }

  const userCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    color: "#fff",
  };
  if (userColor) {
    userCircleStyle.backgroundColor = userColor;
  }

  const assistantCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    color: "#fff",
  };
  if (assistantColor) {
    assistantCircleStyle.backgroundColor = assistantColor;
  }

  let containerClass = "mwai-visualizer";
  if (userVolume >= assistantVolume) {
    containerClass += " mwai-user-talking";
  } else if (assistantVolume >= userVolume) {
    containerClass += " mwai-assistant-talking";
  }

  const renderUI = (uiObj) => {
    if (!uiObj) return null;
    const { emoji, text, image, use } = uiObj;

    switch (use) {
      case "emoji":
        if (emoji) return <span>{emoji}</span>;
        if (text) return <span>{text.slice(0, 1)}</span>;
        return null;
      case "image":
        if (image) {
          return (
            <img
              src={image}
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          );
        }
        if (emoji) return <span>{emoji}</span>;
        if (text) return <span>{text.slice(0, 1)}</span>;
        return null;
      case "text":
      default:
        if (text) return <span>{text.slice(0, 1)}</span>;
        if (emoji) return <span>{emoji}</span>;
        return null;
    }
  };

  return (
    <div className={containerClass}>
      <div
        className="mwai-visualizer-user"
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          overflow: "visible",
        }}
      >
        <div className="mwai-animation" style={userPulseStyle} />

        <div style={userCircleStyle}>{renderUI(userUI)}</div>
      </div>

      <hr className="mwai-visualizer-line" />

      <div
        className="mwai-visualizer-assistant"
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          overflow: "visible",
        }}
      >
        <div className="mwai-animation" style={assistantPulseStyle} />

        <div style={assistantCircleStyle}>{renderUI(assistantUI)}</div>
      </div>
    </div>
  );
}
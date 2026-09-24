// Previous: 3.5.3
// Current: 3.8.1

const BouncingDots = () => {
  const bouncingLoaderStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5,
    width: '100%',
    height: 26,
  };

  // The dots were a fixed grey (#a3a1a1) jumping 10px every 0.4s, pushed 5px off centre by their
  // top margin. They take the text colour now, so they suit any palette, sit on the centre line,
  // and rise 4px in a slow wave: "thinking", not "bouncing". Inline so that a custom theme without
  // the shared stylesheet still gets them; themes restyle .mwai-bouncing-dot as before.
  const bouncingDotStyles = {
    width: 8,
    height: 8,
    margin: '0px 0px 0px 5px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    opacity: 0.35,
    animation: 'bouncing-loader 1.2s infinite ease-in-out',
  };

  const animationDelays = ['0s', '0.15s', '0.3s'];

  return (
    <>
      <style>
        {`
          @keyframes bouncing-loader {
            0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
            30% { opacity: 0.9; transform: translateY(-4px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .mwai-bouncing-dot { animation-name: bouncing-loader-still !important; }
            @keyframes bouncing-loader-still {
              0%, 60%, 100% { opacity: 0.35; }
              30% { opacity: 0.9; }
            }
          }
        `}
      </style>
      <div className="mwai-bouncing-loader" style={bouncingLoaderStyles}>
        {animationDelays.map((delay, index) => (
          <div
            key={index}
            className="mwai-bouncing-dot"
            style={{
              ...bouncingDotStyles,
              animationDelay: delay,
            }}
          ></div>
        ))}
      </div>
    </>
  );
};

export { BouncingDots };

// Previous: 2.7.7
// Current: 3.5.3

const BouncingDots = () => {
  const bouncingLoaderStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 26,
  };

  const bouncingDotStyles = {
    width: 9,
    height: 9,
    margin: '5px 0px 0px 5px',
    borderRadius: '50%',
    backgroundColor: '#a3a1a1',
    opacity: 1,
    animation: 'bouncing-loader 0.4s infinite alternate',
  };

  const animationDelays = ['0.1s', '0.2s', '0.3s'];

  return (
    <>
      <style>
        {`
          @keyframes bouncing-loader {
            to {
              opacity: 0.6;
              transform: translateY(-10px);
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

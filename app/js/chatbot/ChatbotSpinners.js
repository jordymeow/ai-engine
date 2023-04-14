// Previous: none
// Current: 1.4.7

import React from 'react';

const BouncingDots = (props) => {
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
    animation: 'bouncing-loader 0.6s infinite alternate',
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
      <div style={bouncingLoaderStyles}>
        {animationDelays.map((delay, index) => (
          <div
            key={index}
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

export { BouncingDots }

import React, { createContext, useContext, useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const ConfettiContext = createContext();

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

export const ConfettiProvider = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Set window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const triggerConfetti = (duration = 5000) => {
    setShowConfetti(true);
    
    // Auto-stop confetti after specified duration
    setTimeout(() => {
      setShowConfetti(false);
    }, duration);
  };

  const stopConfetti = () => {
    setShowConfetti(false);
  };

  return (
    <ConfettiContext.Provider value={{ triggerConfetti, stopConfetti, showConfetti }}>
      {children}
      
      {/* Global Confetti Component */}
      {showConfetti && (
        <>
          {/* Main confetti burst */}
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
            initialVelocityY={30}
            initialVelocityX={15}
            wind={0.02}
            colors={[
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
              '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E',
              '#E17055', '#00B894', '#00CEC9', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#E84393'
            ]}
          />
          
          {/* Secondary confetti layer */}
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.4}
            initialVelocityY={15}
            initialVelocityX={-10}
            wind={-0.01}
            colors={[
              '#FFD93D', '#6BCF7F', '#4D96FF', '#9B59B6', '#E74C3C', '#F39C12', '#1ABC9C', '#3498DB',
              '#E67E22', '#2ECC71', '#9B59B6', '#34495E', '#F1C40F', '#E74C3C', '#1ABC9C', '#3498DB'
            ]}
          />
          
          {/* Floating confetti */}
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
            initialVelocityY={5}
            initialVelocityX={8}
            wind={0.05}
            colors={[
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
            ]}
          />
        </>
      )}
    </ConfettiContext.Provider>
  );
};

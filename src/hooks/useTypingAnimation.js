import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation effect
 * @param {string[]} texts - Array of texts to cycle through
 * @param {number} typingSpeed - Speed of typing (ms per character)
 * @param {number} pauseDuration - Duration to pause between texts (ms)
 * @param {number} deleteSpeed - Speed of deleting (ms per character)
 * @param {boolean} isEnabled - Whether animation is enabled
 * @returns {string} Current displayed text
 */
export function useTypingAnimation(texts, typingSpeed = 100, pauseDuration = 2000, deleteSpeed = 50, isEnabled = true) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isEnabled || texts.length === 0) {
      setCurrentText(texts[0] || '');
      return;
    }

    const currentFullText = texts[currentTextIndex];
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing phase
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setIsPaused(true);
        }
      } else {
        // Deleting phase
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, typingSpeed, pauseDuration, deleteSpeed, isEnabled]);

  return currentText;
}

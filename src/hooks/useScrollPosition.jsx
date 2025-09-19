// src/hooks/useScrollPosition.jsx
import { useEffect, useState } from 'react';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.scrollTo(0,0)
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    // Throttle scroll handler
    let throttleTimeout;
    const throttledHandleScroll = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleScroll();
          throttleTimeout = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
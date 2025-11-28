import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer Hook for Scroll Animations
 * Detects when elements enter the viewport and triggers animations
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} - { ref, isVisible } - Attach ref to element to observe
 */
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Extract options to avoid dependency array issues
  const threshold = options.threshold || 0.1;
  const rootMargin = options.rootMargin || '0px';

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Only set to visible once, don't reset when scrolling up
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    }, {
      threshold, // Trigger when 10% visible by default
      rootMargin,
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible, options]);

  return { ref, isVisible };
};

/**
 * Hook for staggered animation of child elements
 * Returns array of refs and visibility states for each child
 * @param {number} count - Number of children to animate
 * @param {number} delay - Delay between each child animation (ms)
 * @returns {Array} - Array of { ref, isVisible, style } objects
 *
 * Note: This hook is currently unused but kept for future use.
 * If ESLint errors occur, this can be safely removed.
 */
export const useStaggerAnimation = (count, delay = 100) => {
  // Initialize items with refs created at initialization time
  const [items] = useState(() =>
    Array.from({ length: count }, () => ({
      ref: { current: null }, // Create plain object refs instead of useRef
      isVisible: false,
    }))
  );

  const [visibleStates, setVisibleStates] = useState(
    Array.from({ length: count }, () => false)
  );

  useEffect(() => {
    const observers = items.map((item, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !visibleStates[index]) {
            // Set visible with delay based on index
            setTimeout(() => {
              setVisibleStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            }, index * delay);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px',
        }
      );

      if (item.ref.current) {
        observer.observe(item.ref.current);
      }

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [count, delay, items, visibleStates]);

  return items.map((item, index) => ({
    ref: item.ref,
    isVisible: visibleStates[index],
    style: {
      opacity: visibleStates[index] ? 1 : 0,
      transform: visibleStates[index] ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.5s ease-out ${index * delay}ms, transform 0.5s ease-out ${index * delay}ms`,
    },
  }));
};

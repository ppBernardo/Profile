import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export const useInView = ({ threshold = 0.15, rootMargin = '0px', once = true }: UseInViewOptions = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
};


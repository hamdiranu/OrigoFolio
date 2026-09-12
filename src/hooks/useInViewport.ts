import { useEffect, useRef, useState } from "react";

interface UseInViewportOptions {
  rootMargin?: string;
  defaultVisible?: boolean;
}

export function useInViewport<T extends HTMLElement>({
  rootMargin = "200px",
  defaultVisible = false,
}: UseInViewportOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [hasBeenVisible, setHasBeenVisible] = useState(defaultVisible);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible, hasBeenVisible };
}

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "20%"
}: UseInfiniteScrollProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        rootMargin,
      }
    );

    const currentRef = targetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return targetRef;
}; 
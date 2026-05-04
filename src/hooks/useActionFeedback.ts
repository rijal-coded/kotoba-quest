import { useState, useCallback } from 'react';

type FeedbackType = 'damage' | 'heal' | 'attack' | null;

/**
 * Hook for managing transient visual feedback animations.
 * Returns state flags and trigger functions that auto-clear after animation duration (300ms).
 */
export const useActionFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const trigger = useCallback((type: FeedbackType) => {
    setFeedback(type);
    // Auto-clear after animation duration
    setTimeout(() => setFeedback(null), 300);
  }, []);

  return {
    feedback,
    trigger,
  };
};

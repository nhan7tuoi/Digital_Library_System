import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown({ countStart, countStop = 0, intervalMs = 1000 }) {
  const [count, setCount] = useState(countStart);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const intervalRef = useRef(null);

  const startCountdown = useCallback(() => {
    setIsCountdownRunning(true);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsCountdownRunning(false);
  }, []);

  const resetCountdown = useCallback(() => {
    stopCountdown();
    setCount(countStart);
  }, [stopCountdown, countStart]);

  const countdownCallback = useCallback(() => {
    setCount((prevCount) => {
      if (prevCount === countStop) {
        stopCountdown();
        return prevCount;
      }
      return prevCount - 1;
    });
  }, [countStop, stopCountdown]);

  useEffect(() => {
    if (isCountdownRunning && !intervalRef.current) {
      intervalRef.current = setInterval(countdownCallback, intervalMs);
    }

    if (!isCountdownRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCountdownRunning, countdownCallback, intervalMs]);

  return [count, { startCountdown, stopCountdown, resetCountdown }];
}

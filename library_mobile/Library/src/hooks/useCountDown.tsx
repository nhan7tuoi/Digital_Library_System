import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownProps {
    countStart: number;
    countStop?: number;
    intervalMs?: number;
}

interface CountdownActions {
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
}

export function useCountdown({
    countStart,
    countStop = 0,
    intervalMs = 1000,
}: UseCountdownProps): [number, CountdownActions] {
    const [count, setCount] = useState<number>(countStart);
    const [isCountdownRunning, setIsCountdownRunning] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
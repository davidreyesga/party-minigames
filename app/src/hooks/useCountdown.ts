import { useCallback, useEffect, useRef, useState } from "react";

type CountdownSeconds = number | null | undefined;

export type CountdownOptions = {
  autoStart?: boolean;
  onFinish?: () => void;
};

export type Countdown = {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  restartWith: (seconds: CountdownSeconds) => void;
};

function normalizeSeconds(value: CountdownSeconds): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
}

export function useCountdown(
  initialSeconds?: CountdownSeconds,
  { autoStart = false, onFinish }: CountdownOptions = {},
): Countdown {
  const initialValue = useRef(normalizeSeconds(initialSeconds)).current;
  const [seconds, setSeconds] = useState(initialValue);
  const [totalSeconds, setTotalSeconds] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);

  const secondsRef = useRef(initialValue);
  const totalSecondsRef = useRef(initialValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishNotifiedRef = useRef(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const run = useCallback(() => {
    clearTimer();

    if (secondsRef.current <= 0) {
      setIsRunning(false);
      return;
    }

    finishNotifiedRef.current = false;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      const nextSeconds = Math.max(0, secondsRef.current - 1);
      secondsRef.current = nextSeconds;
      setSeconds(nextSeconds);

      if (nextSeconds === 0) {
        clearTimer();
        setIsRunning(false);

        if (!finishNotifiedRef.current) {
          finishNotifiedRef.current = true;
          onFinishRef.current?.();
        }
      }
    }, 1000);
  }, [clearTimer]);

  const start = useCallback(() => {
    if (secondsRef.current <= 0 && totalSecondsRef.current > 0) {
      secondsRef.current = totalSecondsRef.current;
      setSeconds(totalSecondsRef.current);
    }

    run();
  }, [run]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (secondsRef.current > 0) {
      run();
    }
  }, [run]);

  const reset = useCallback(() => {
    clearTimer();
    secondsRef.current = totalSecondsRef.current;
    finishNotifiedRef.current = false;
    setSeconds(totalSecondsRef.current);
    setIsRunning(false);
  }, [clearTimer]);

  const restartWith = useCallback(
    (nextInitialSeconds: CountdownSeconds) => {
      clearTimer();

      const nextTotalSeconds = normalizeSeconds(nextInitialSeconds);
      secondsRef.current = nextTotalSeconds;
      totalSecondsRef.current = nextTotalSeconds;
      finishNotifiedRef.current = false;
      setSeconds(nextTotalSeconds);
      setTotalSeconds(nextTotalSeconds);

      if (nextTotalSeconds > 0) {
        run();
      } else {
        setIsRunning(false);
      }
    },
    [clearTimer, run],
  );

  useEffect(() => {
    if (autoStart) {
      start();
    } else {
      clearTimer();
      setIsRunning(false);
    }

    return clearTimer;
  }, [autoStart, clearTimer, start]);

  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;

  return {
    seconds,
    totalSeconds,
    isRunning,
    isFinished: seconds === 0,
    progress,
    start,
    pause,
    resume,
    reset,
    restartWith,
  };
}

export default useCountdown;

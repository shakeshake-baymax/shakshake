import { useCallback, useEffect, useRef, useState } from "react";

export default function useCountdown(time: number) {
  const [timeRemaining, setTimeRemaining] = useState(time);
  const intervalRef = useRef<any>(0);
  const resetTimer = useCallback(() => {
    setTimeRemaining(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const startCounting = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevState) => prevState - 1);
    }, 1000);
  }, []);
  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);
  useEffect(() => {
    if (timeRemaining < 0) {
      stopTimer();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevState) => prevState - 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return { timeRemaining, stopTimer, startCounting, resetTimer };
}

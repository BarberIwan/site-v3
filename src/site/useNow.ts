import { useSyncExternalStore } from 'react';

// De huidige tijd per minuut. Tijdens het vooraf renderen en de hydratie is er
// geen "nu" (null), zodat de server-HTML en de eerste render in de browser
// gelijk zijn; direct daarna rendert React opnieuw met de echte tijd.

const MINUTE = 60_000;

const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, MINUTE);
  return () => clearInterval(timer);
};

const minuteNow = () => Math.floor(Date.now() / MINUTE);
const noMinute = () => null;

export function useNow(): Date | null {
  const minute = useSyncExternalStore(subscribe, minuteNow, noMinute);
  return minute === null ? null : new Date(minute * MINUTE);
}

import { useEffect } from "react";

export function usePolling(callback: () => void, intervalMs: number) {
  useEffect(() => {
    callback();

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      callback();
    }, intervalMs);

    // Refetch immediately when the tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        callback();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback, intervalMs]);
}

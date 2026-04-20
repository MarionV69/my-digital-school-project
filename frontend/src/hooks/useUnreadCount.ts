import { useState, useCallback, useRef } from "react";
import { usePolling } from "./usePolling";
import { getUnreadCount } from "../api/conversations";

export function useUnreadCount(onIncrease?: () => void) {
  const [unreadCount, setUnreadCount] = useState(0);
  const prevRef = useRef<number>(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();

      if (count !== prevRef.current && onIncrease) {
        onIncrease();
      }

      prevRef.current = count;
      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Error fetching unread count:",
        error instanceof Error ? error.message : error,
      );
    }
  }, [onIncrease]);

  usePolling(fetchUnreadCount, 30_000);

  return { unreadCount, refreshUnreadCount: fetchUnreadCount };
}

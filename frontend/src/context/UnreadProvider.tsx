import { useState, type ReactNode } from "react";
import { UnreadContext } from "./UnreadContext";
import { getUnreadCount } from "@/api/conversations";
import { usePolling } from "@/hooks/usePolling";

type UnreadProviderProps = {
  children: ReactNode;
};

export function UnreadProvider({ children }: UnreadProviderProps) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const fetchTotalUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setTotalUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // polling
  usePolling(fetchTotalUnreadCount, 30_000);

  return (
    <UnreadContext.Provider
      value={{
        totalUnreadCount,
        refreshTotalUnreadCount: fetchTotalUnreadCount,
      }}
    >
      {children}
    </UnreadContext.Provider>
  );
}

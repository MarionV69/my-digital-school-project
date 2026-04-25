import { useOutletContext } from "react-router-dom";

type UnreadContextType = {
  totalUnreadCount: number;
  refreshTotalUnreadCount: () => Promise<void>;
};

export function useUnread() {
  return useOutletContext<UnreadContextType>();
}

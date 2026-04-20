import { createContext } from "react";

export type UnreadContextType = {
  totalUnreadCount: number;
  refreshTotalUnreadCount: () => Promise<void>;
};

export const UnreadContext = createContext<UnreadContextType | null>(null);

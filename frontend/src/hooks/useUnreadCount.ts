import { useContext } from "react";
import { UnreadContext } from "@/context/UnreadContext";

export function useUnread() {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error("useUnread must be used within UnreadProvider");
  }
  return context;
}

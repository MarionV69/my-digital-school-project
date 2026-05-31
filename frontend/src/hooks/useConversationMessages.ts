import { getConversationMessages } from "@/api/conversations";
import type { Message } from "@/types/conversations.types";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function useConversationMessages(
  conversationId: number,
  unreadCount: number | undefined,
  onRefresh: () => Promise<void>,
  onRefreshConversations: () => Promise<void>,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const prevUnreadCount = useRef<number>(0);

  useEffect(() => {
    const currentUnread = unreadCount ?? 0;
    const hasNewMessages = currentUnread > prevUnreadCount.current;
    prevUnreadCount.current = currentUnread;

    // Si ce n'est pas le fetch initial et qu'il n'y a pas de nouveaux messages → rien à faire
    if (messages.length > 0 && !hasNewMessages) return;

    setLoading(messages.length === 0); // spinner uniquement au fetch initial

    const fetchMessages = async () => {
      try {
        const data = await getConversationMessages(conversationId);
        setMessages(data);
        await Promise.all([onRefresh(), onRefreshConversations()]);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, unreadCount]);

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    onRefreshConversations();
  };

  return { messages, loading, handleMessageSent };
}
export default useConversationMessages;

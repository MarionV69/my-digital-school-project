import { getConversationMessages } from "@/api/conversations";
import type { Message } from "@/types/conversations.types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useConversationMessages(
  conversationId: number,
  unreadCount: number | undefined,
  onRefresh: () => Promise<void>,
  onRefreshConversations: () => Promise<void>,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [conversationId, unreadCount, onRefresh, onRefreshConversations]);

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    onRefreshConversations();
  };

  return { messages, loading, handleMessageSent };
}
export default useConversationMessages;

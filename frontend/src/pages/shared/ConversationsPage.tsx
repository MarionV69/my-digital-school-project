import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { Conversation } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import ConversationDetail from "../../components/conversations/ConversationDetail";
import ConversationItem from "../../components/conversations/ConversationItem";
import { getConversations } from "@/api/conversations";
import ContactButton from "@/components/conversations/ContactButton";
import { useUnread } from "@/hooks/useUnreadCount";

function ConversationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalUnreadCount } = useUnread();

  const initialConversationId = location.state?.conversationId ?? null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(
    initialConversationId,
  );
  const [showDetail, setShowDetail] = useState(!!initialConversationId);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch conversations when totalUnreadCount changes to update unread badges
  useEffect(() => {
    fetchConversations();
  }, [totalUnreadCount, fetchConversations]);

  // Clean navigation state to prevent unwanted conversation selection on back/forward navigation
  useEffect(() => {
    if (location.state) {
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) || null;

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedId(conversation.id);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-73px)] flex-col items-center justify-center gap-3">
        <MessageSquare className="size-12 text-muted-foreground/30" />
        <p className="font-medium text-muted-foreground">Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      <div
        className={`${
          showDetail ? "hidden md:flex" : "flex"
        } w-full flex-col border-r border-border md:w-72 lg:w-96`}
      >
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">
            Conversations
          </h1>
          <ContactButton supplierId={4} />
        </div>

        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <ConversationItem
                conversation={conversation}
                onSelect={() => handleSelectConversation(conversation)}
                isActive={selectedId === conversation.id}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`${showDetail ? "flex" : "hidden md:flex"} flex-1 flex-col`}
      >
        <div className="md:hidden">
          <button
            onClick={handleBack}
            className="cursor-pointer p-4 text-sm text-muted-foreground"
          >
            ← Retour
          </button>
        </div>

        {selectedConversation ? (
          <ConversationDetail conversation={selectedConversation} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <MessageSquare className="size-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Sélectionnez une conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationsPage;

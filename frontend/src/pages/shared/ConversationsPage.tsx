import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import type { Conversation } from "../../types/conversations.types";
import { getConversations } from "../../api/conversations";
import { Spinner } from "@/components/ui/spinner";
import ConversationDetail from "../../components/conversations/ConversationDetail";
import ConversationItem from "../../components/conversations/ConversationItem";

function ConversationsPage() {
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        // Auto-select conversation if coming from ContactButton
        const conversationId = location.state?.conversationId;
        if (conversationId) {
          const target = data.find((c) => c.id === conversationId);
          if (target) {
            setSelectedConversation({ ...target, unreadCount: 0 });
            setShowDetail(true);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Erreur lors du chargement des conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [location.state]);

  const handleSelectConversation = (conversation: Conversation) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
      ),
    );
    setSelectedConversation({ ...conversation, unreadCount: 0 });
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
      {/* Conversation list */}
      <div
        className={`${
          showDetail ? "hidden md:flex" : "flex"
        } w-full flex-col border-r border-border md:w-72 lg:w-96`}
      >
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">
            Conversations
          </h1>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <ConversationItem
                conversation={conversation}
                onSelect={() => handleSelectConversation(conversation)}
                isActive={selectedConversation?.id === conversation.id}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Conversation detail */}
      <div
        className={`${showDetail ? "flex" : "hidden md:flex"} flex-1 flex-col`}
      >
        {/* Back button — mobile only */}
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

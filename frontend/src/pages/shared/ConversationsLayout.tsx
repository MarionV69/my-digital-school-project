import { useCallback, useEffect, useState } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { Conversation } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import ConversationItem from "../../components/conversations/ConversationItem";
import { getConversations } from "@/api/conversations";
import { cn } from "@/lib/utils";
import type { AppLayoutOutletContext } from "@/layouts/AppLayout";

export type ConversationsOutletContext = {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  refreshTotalUnreadCount: () => Promise<void>;
};

function ConversationsLayout() {
  const { id } = useParams();
  const { totalUnreadCount, refreshTotalUnreadCount } =
    useOutletContext<AppLayoutOutletContext>();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex h-[calc(100dvh-73px)] overflow-hidden">
      {/* List - hidden on mobile when detail is shown */}
      <div
        className={cn(
          "flex-col border-r border-border md:flex md:w-72 lg:w-96",
          id ? "hidden md:flex" : "flex w-full",
        )}
      >
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold text-foreground">
            Conversations
          </h2>
        </div>
        <nav aria-label="Conversations">
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationItem
                  conversation={conversation}
                  isActive={String(conversation.id) === id}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Detail — Outlet */}
      <div className={cn("flex-1 flex-col", id ? "flex" : "hidden md:flex")}>
        <Outlet
          context={{
            conversations,
            refreshConversations: fetchConversations,
            refreshTotalUnreadCount,
          }}
        />
      </div>
    </div>
  );
}

export default ConversationsLayout;

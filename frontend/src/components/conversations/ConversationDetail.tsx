import { useEffect, useRef } from "react";
import { ChevronLeft, MessageSquare, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import MessageBubble from "../../components/conversations/MessageBubble";
import MessageInput from "../../components/conversations/MessageInput";
import { cn } from "@/lib/utils";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ConversationsOutletContext } from "@/pages/shared/ConversationsLayout";
import { Button } from "../ui/button";
import OtherParticipantPreview from "./OtherParticipantPreview";
import useConversationMessages from "@/hooks/useConversationMessages";

type ConversationDetailProps = {
  conversationId: number;
};

function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const navigate = useNavigate();
  const { conversations, refreshConversations, refreshTotalUnreadCount } =
    useOutletContext<ConversationsOutletContext>();

  const conversation = conversations.find((c) => c.id === conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading, handleMessageSent } = useConversationMessages(
    conversationId,
    conversation?.unreadCount,
    refreshTotalUnreadCount,
    refreshConversations,
  );

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (loading) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: isFirstLoad.current ? "instant" : "smooth",
    });
    isFirstLoad.current = false;
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">
          Conversation introuvable
        </p>
        <Button variant="outline" onClick={() => navigate("/conversations")}>
          Retour aux conversations
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-73px)] flex-col",
        "bg-background md:bg-muted",
      )}
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        {/* Back button - hidden from md */}
        <button
          onClick={() => navigate("/conversations")}
          className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-muted md:hidden"
          aria-label="Retour aux conversations"
        >
          <ChevronLeft className="size-5 text-foreground" />
        </button>

        {/* Avatar */}
        {conversation.otherParticipant.avatarUrl ? (
          <img
            src={conversation.otherParticipant.avatarUrl}
            alt={conversation.otherParticipant.name}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
        )}

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {conversation.otherParticipant.name}
          </p>
        </div>

        {/* Other participant preview trigger */}
        <OtherParticipantPreview conversation={conversation} />
      </header>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <MessageSquare className="size-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Aucun message pour l'instant.
            </p>
            <p className="text-xs text-muted-foreground">
              Envoyez le premier message !
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Input */}
      <MessageInput
        conversationId={conversation.id}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}

export default ConversationDetail;

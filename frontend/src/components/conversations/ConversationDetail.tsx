import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ExternalLink, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";
import { getConversationMessages } from "../../api/conversations";
import type { Conversation, Message } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import MessageBubble from "../../components/conversations/MessageBubble";
import MessageInput from "../../components/conversations/MessageInput";
import { cn } from "@/lib/utils";

type ConversationDetailProps = {
  conversation: Conversation;
};

function ConversationDetail({ conversation }: ConversationDetailProps) {
  const [show, setShow] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const data = await getConversationMessages(conversation.id);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversation.id]);

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        "bg-background md:bg-muted",
        !show && "hidden",
      )}
    >
      {" "}
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        {/* Back button — mobile only */}
        <button
          onClick={() => setShow(false)}
          className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-muted sm:hidden"
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

        {/* Recipient details */}
        <button
          className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-muted"
          aria-label="Voir le profil"
        >
          <ExternalLink className="size-4 text-muted-foreground" />
        </button>
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

import { User } from "lucide-react";
import type { Conversation } from "../../types/conversations.types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type ConversationItemProps = {
  conversation: Conversation;
  isActive?: boolean;
};

function ConversationItem({
  conversation,
  isActive = false,
}: ConversationItemProps) {
  // Format date relative
  const formatRelativeTime = (date: Date | null): string => {
    if (!date) return "";

    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";

    return messageDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <Link
      to={`/conversations/${conversation.id}`}
      className={cn(
        "flex w-full items-center gap-3 border-b border-border px-4 py-3 transition-colors",
        isActive ? "bg-muted" : "bg-background hover:bg-muted/50",
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
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
        {/* Unread badge */}
        {conversation.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-xs font-medium text-primary-foreground">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      {/* Name + Date */}
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {conversation.otherParticipant.name}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ConversationItem;

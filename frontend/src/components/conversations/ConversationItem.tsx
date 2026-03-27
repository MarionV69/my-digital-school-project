import { MessageCircle } from "lucide-react";
import type { Conversation } from "../../types/conversations.types";

type ConversationItemProps = {
  conversation: Conversation;
  onSelect: () => void;
  isActive?: boolean;
};

function ConversationItem({
  conversation,
  onSelect,
  isActive = false,
}: ConversationItemProps) {
  // Format date relative
  const formatRelativeTime = (date: Date | null): string => {
    if (!date) return "Jamais";

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
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200 transition-colors ${
        isActive ? "bg-gray-100" : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Icon */}
      <div className="shrink-0 w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-white">
        <MessageCircle className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Name + Date */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-semibold text-brand-dark truncate">
            {conversation.otherParticipant.name}
          </h3>
          <span className="text-xs text-gray-500 shrink-0">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        {/* Unread */}
        {conversation.unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-accent text-white text-xs font-semibold rounded-full">
              {conversation.unreadCount}
            </span>
            <span className="text-sm text-gray-600">
              {conversation.unreadCount === 1
                ? "nouveau message"
                : "nouveaux messages"}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

export default ConversationItem;

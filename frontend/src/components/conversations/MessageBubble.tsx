import { FileText, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Message } from "../../types/conversations.types";
import { openAttachment } from "../../api/conversations";

type MessageBubbleProps = {
  message: Message;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();

  // Determine if this is my message or the other participant's
  const isMine = message.senderType === user?.establishmentType;

  // Smart date/time formatting
  const formatTime = (date: Date): string => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // If less than 24h → Show only time
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If 24h or more → Show date + time
    return messageDate.toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[90%] rounded-lg px-4 py-2 shadow-md ${
          isMine
            ? "bg-brand-light text-white"
            : "bg-gray-200/80 text-brand-dark"
        }`}
      >
        {/* Message content */}
        <p className="whitespace-pre-wrap wrap-break-words">
          {message.content}
        </p>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment) => {
              const isImage = attachment.mimeType.startsWith("image/");

              return (
                <button
                  key={attachment.id}
                  onClick={() => openAttachment(attachment.endpoint)}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:cursor-pointer transition ${
                    isMine
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-white hover:bg-gray-50 text-brand-dark"
                  }`}
                >
                  {isImage ? (
                    <ImageIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-sm">{attachment.originalFilename}</span>
                  <span className="text-xs opacity-75 shrink-0">
                    ({(attachment.size / 1024).toFixed(0)} Ko)
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-xs mt-1 ${
            isMine ? "text-white/70" : "text-gray-500"
          }`}
        >
          {formatTime(message.sentAt)}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;

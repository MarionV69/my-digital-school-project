import { FileText, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Message } from "../../types/conversations.types";
import { openAttachment } from "../../api/conversations";
import { cn } from "@/lib/utils";

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
    <div
      className={cn("mb-4 flex flex-col", isMine ? "items-end" : "items-start")}
    >
      {/* Timestamp */}
      <span className="mb-1 px-1 text-xs text-muted-foreground">
        {formatTime(message.sentAt)}
      </span>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isMine
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-background text-foreground shadow-sm rounded-tl-none",
        )}
      >
        {/* Message content */}
        <p className="whitespace-pre-wrap wrap-break-word text-sm">
          {message.content}
        </p>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {message.attachments.map((attachment) => {
              const isImage = attachment.mimeType.startsWith("image/");

              return (
                <button
                  key={attachment.id}
                  onClick={() => openAttachment(attachment.endpoint)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left transition-colors",
                    isMine
                      ? "hover:bg-white/10 text-primary-foreground"
                      : "hover:bg-muted/80 text-foreground",
                  )}
                >
                  {isImage ? (
                    <ImageIcon className="size-4 shrink-0" />
                  ) : (
                    <FileText className="size-4 shrink-0" />
                  )}
                  <span className="truncate text-sm">
                    {attachment.originalFilename}
                  </span>
                  <span className="shrink-0 text-xs opacity-70">
                    ({(attachment.size / 1024).toFixed(0)} Ko)
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;

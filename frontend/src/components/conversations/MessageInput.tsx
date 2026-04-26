import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Send, Paperclip, X } from "lucide-react";
import toast from "react-hot-toast";
import { sendAttachment, sendMessage } from "../../api/conversations";
import type { Message } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { UPLOAD_CONFIG } from "@/config/upload.config";

type PendingFile = {
  id: string;
  file: File;
};

type MessageInputProps = {
  conversationId: number;
  onMessageSent: (message: Message) => void;
};

function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim() && pendingFiles.length === 0) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    setSending(true);
    try {
      const message = await sendMessage(conversationId, {
        content,
        attachment: pendingFiles[0]?.file,
      });

      // Send remaining attachments one by one
      if (pendingFiles.length > 1) {
        for (const pendingFile of pendingFiles) {
          const attachment = await sendAttachment(
            conversationId,
            message.id,
            pendingFile.file,
          );
          message.attachments.push(attachment);
        }
      }

      onMessageSent(message);
      setContent("");
      setPendingFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    const oversized = files.filter((f) => f.size > UPLOAD_CONFIG.MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error(
        `Chaque fichier ne doit pas dépasser ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024} Mo`,
      );
      return;
    }

    setPendingFiles((prev) => {
      const newFiles = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      const combined = [...prev, ...newFiles];
      if (combined.length > UPLOAD_CONFIG.MAX_FILES) {
        toast.error(`Maximum ${UPLOAD_CONFIG.MAX_FILES} fichiers par message`);
        return prev;
      }
      return combined;
    });
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {pendingFiles.map(({ id, file }) => (
            <div
              key={id}
              className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5"
            >
              <Paperclip className="size-3 shrink-0 text-muted-foreground" />
              <span className="max-w-32 truncate text-xs text-foreground">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(id)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || pendingFiles.length >= UPLOAD_CONFIG.MAX_FILES}
          className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          aria-label="Joindre un fichier"
        >
          <Paperclip className="size-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept={UPLOAD_CONFIG.ACCEPTED_MIME_TYPES}
        />

        {/* Text input */}
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message"
          disabled={sending}
          className={cn(
            "flex-1 rounded-lg bg-muted px-3 py-2 text-sm outline-none",
            "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={sending || (!content.trim() && pendingFiles.length === 0)}
          className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Envoyer"
        >
          {sending ? (
            <Spinner className="size-5 text-primary-foreground" />
          ) : (
            <Send className="size-5" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;

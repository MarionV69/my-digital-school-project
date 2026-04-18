import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import toast from "react-hot-toast";
import { sendMessage, sendAttachment } from "../../api/conversations";
import type { Message } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  conversationId: number;
  onMessageSent: (message: Message) => void;
};

function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && pendingFiles.length === 0) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    setSending(true);
    try {
      const message = await sendMessage(
        conversationId,
        content.trim() || "📎 Pièce jointe",
      );

      // Attach all pending files
      if (pendingFiles.length > 0) {
        await Promise.all(
          pendingFiles.map((file) => sendAttachment(message.id, file)),
        );
        setPendingFiles([]);
      }

      onMessageSent(message);
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setPendingFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {pendingFiles.map((file, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5"
            >
              <Paperclip className="size-3 shrink-0 text-muted-foreground" />
              <span className="max-w-32 truncate text-xs text-foreground">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
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
          disabled={sending}
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
          accept="*/*"
        />

        {/* Text input */}
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message"
          disabled={sending}
          autoFocus
          className={cn(
            "flex-1 rounded-lg bg-muted px-3 py-2 text-sm outline-none",
            "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={sending || (!content.trim() && pendingFiles.length === 0)}
          className="cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
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

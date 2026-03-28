import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { sendMessage } from "../../api/conversations";
import type { Message } from "../../types/conversations.types";

type MessageInputProps = {
  conversationId: number;
  onMessageSent: (message: Message) => void;
};

function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    setSending(true);
    try {
      const message = await sendMessage(conversationId, content.trim());
      onMessageSent(message);
      setContent(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-300 p-4 bg-white"
    >
      <div className="flex gap-3 items-end">
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={sending}
          rows={3}
          autoFocus
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* Bouton envoyer */}
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="btn"
        >
          <Send className="w-5 h-5" />
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;

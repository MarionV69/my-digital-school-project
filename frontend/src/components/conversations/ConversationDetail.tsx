import { useEffect, useState, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import { getConversationMessages } from "../../api/conversations";
import type { Conversation, Message } from "../../types/conversations.types";
import MessageBubble from "../../components/conversations/MessageBubble";
import MessageInput from "../../components/conversations/MessageInput";

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
      <div className="flex items-center justify-center h-full overflow-y-scroll">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${!show && "hidden"}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 shadow flex items-center gap-3">
        <button
          onClick={() => setShow(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer sm:hidden"
          aria-label="Retour aux conversations"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-brand-dark">
              {conversation?.otherParticipant.name || "Conversation"}
            </h1>
            <p className="text-sm text-gray-500">
              {messages.length} message{messages.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 px-4 pb-0  bg-cream/20">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun message pour l'instant.</p>
            <p className="text-sm mt-1">Envoyez le premier message !</p>
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

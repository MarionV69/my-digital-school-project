import { useEffect, useState } from "react";
import type { Conversation } from "../../types/conversations.types";
import { getConversations } from "../../api/conversations";
import toast from "react-hot-toast";
import { ArrowLeft, MessageSquare } from "lucide-react";
import ConversationDetail from "../../components/conversations/ConversationDetail";
import ConversationItem from "../../components/conversations/ConversationItem";

function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Erreur lors du chargement des conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
      ),
    );
    setSelectedConversation({ ...conversation, unreadCount: 0 });
    setShowDetail(true); // mobile
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10">Chargement des conversations...</div>
    );
  }
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Aucune conversation
          </h2>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-cream border-2 border-brand-dark max-w-6xl mx-auto my-6 p-6 md:p-8 lg:12 rounded-lg text-brand-dark md:grid md:grid-cols-[1fr_2fr] md:gap-6 lg:gap-8">
      <div
        className={`${
          showDetail ? "hidden md:block" : "block"
        } overflow-y-auto`}
      >
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-4">
            Messagerie
          </h1>
          <p className="text-gray-600 mb-4">
            {conversations.length} conversation
            {conversations.length > 1 ? "s" : ""}
          </p>
          <div className="bg-white rounded-lg shadow-md overflow-hidden m-1">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onSelect={() => handleSelectConversation(conversation)}
                isActive={selectedConversation?.id === conversation.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${
          showDetail ? "block" : "hidden md:block"
        } h-full flex flex-col`}
      >
        <div className="md:hidden pb-2">
          <button
            onClick={handleBack}
            className="btn hover:-translate-x-1 bg-brand-dark rounded-full font-medium fixed top-2 right-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
        <div className="flex-1 rounded-lg shadow-md overflow-hidden bg-white h-full">
          {selectedConversation ? (
            <ConversationDetail conversation={selectedConversation} />
          ) : (
            <div className="text-center bg-cream/20 h-full flex flex-col items-center justify-center gap-3 text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-300" />
              <p className="font-medium">Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ConversationsPage;

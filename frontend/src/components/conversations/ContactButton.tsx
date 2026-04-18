import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createConversation } from "../../api/conversations";

type ContactButtonProps = {
  supplierId: number;
};

function ContactButton({ supplierId }: ContactButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContactClick = async () => {
    setLoading(true);
    try {
      const conversation = await createConversation(supplierId);
      navigate("/conversations", {
        state: { conversationId: conversation.id },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContactClick}
      disabled={loading}
      className="btn flex items-center gap-2"
    >
      <MessageCircle className="w-5 h-5" />
      {loading ? "Chargement..." : "Contacter le fournisseur"}
    </button>
  );
}

export default ContactButton;

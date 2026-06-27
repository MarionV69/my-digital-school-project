import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createConversation } from "../../api/conversations";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle } from "lucide-react";

type ContactButtonProps = {
  supplierId: number;
};

function ContactButton({ supplierId }: ContactButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContactClick = async () => {
    if (!user) {
      navigate("/register", { state: { supplierId } });
      return;
    }
    setLoading(true);
    try {
      const conversation = await createConversation(supplierId);
      navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleContactClick} disabled={loading}>
      <span className="hidden lg:inline">
        {loading ? "Chargement..." : "Contacter le fournisseur"}
      </span>
      <MessageCircle className="lg:hidden w-4 h-4"></MessageCircle>
    </Button>
  );
}

export default ContactButton;

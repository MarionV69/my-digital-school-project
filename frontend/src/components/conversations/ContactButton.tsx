import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createConversation } from "../../api/conversations";
import { Button } from "../ui/button";

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
      {loading ? "Chargement..." : "Contacter le fournisseur"}
    </Button>
  );
}

export default ContactButton;

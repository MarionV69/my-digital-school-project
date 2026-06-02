import { useParams } from "react-router-dom";
import ConversationDetail from "@/components/conversations/ConversationDetail";

function ConversationDetailPage() {
  const { id } = useParams();

  return <ConversationDetail key={id} conversationId={Number(id)} />;
}

export default ConversationDetailPage;

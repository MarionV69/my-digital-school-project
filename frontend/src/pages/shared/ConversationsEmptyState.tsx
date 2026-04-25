import { MessageSquare } from "lucide-react";

function ConversationsEmptyState() {
  return (
    <div className="flex flex-1 h-full flex-col items-center justify-center gap-3">
      <MessageSquare className="size-12 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">
        Sélectionnez une conversation
      </p>
    </div>
  );
}

export default ConversationsEmptyState;

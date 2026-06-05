import { useCallback, useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Search, User } from "lucide-react";
import type { Conversation } from "../../types/conversations.types";
import { Spinner } from "@/components/ui/spinner";
import ConversationItem from "../../components/conversations/ConversationItem";
import { createConversation, getConversations } from "@/api/conversations";
import { cn } from "@/lib/utils";
import type { AppLayoutOutletContext } from "@/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { getSuppliers } from "@/api/suppliers";
import type { Supplier } from "@/types/supplier";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export type ConversationsOutletContext = {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  refreshTotalUnreadCount: () => Promise<void>;
};

function ConversationsLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { totalUnreadCount, refreshTotalUnreadCount } =
    useOutletContext<AppLayoutOutletContext>();
  const { user } = useAuth();
  const isRestaurant = user?.establishmentType === "RESTAURANT";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch conversations when totalUnreadCount changes to update unread badges
  useEffect(() => {
    fetchConversations();
  }, [totalUnreadCount, fetchConversations]);

  useEffect(() => {
    if (!isRestaurant) return;
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, [isRestaurant]);

  const handleSupplierSelect = async (supplier: Supplier | null) => {
    if (!supplier) return;
    setInputValue("");
    try {
      const conversation = await createConversation(supplier.id);
      await fetchConversations();
      navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Error opening conversation:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-73px)] overflow-hidden">
      {/* List - hidden when detail is shown, visible from md */}
      <div
        className={cn(
          "flex-col border-r border-border md:flex md:w-72 lg:w-96",
          id ? "hidden md:flex" : "flex w-full",
        )}
      >
        <div className="border-b border-border px-6 py-5 space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Conversations
          </h2>
          {isRestaurant && (
            <Combobox<Supplier>
              items={suppliers}
              itemToStringValue={(supplier) => supplier.name}
              onValueChange={handleSupplierSelect}
              filter={(item: Supplier, inputValue: string) =>
                item.name.toLowerCase().includes(inputValue.toLowerCase())
              }
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                <ComboboxInput
                  placeholder="Rechercher un fournisseur..."
                  showTrigger={false}
                  showClear
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 bg-muted border-transparent hover:border-muted-foreground"
                />
              </div>

              <ComboboxContent>
                <ComboboxEmpty>Aucun fournisseur trouvé</ComboboxEmpty>
                <ComboboxList>
                  {(supplier) => (
                    <ComboboxItem key={supplier.id} value={supplier}>
                      {supplier.coverPhotoUrl ? (
                        <img
                          src={supplier.coverPhotoUrl}
                          alt={supplier.name}
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex size-7 items-center justify-center rounded-full bg-muted border border-border shrink-0">
                          <User className="size-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{supplier.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {supplier.city}
                        </p>
                      </div>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </div>
        <nav aria-label="Conversations">
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationItem
                  conversation={conversation}
                  isActive={String(conversation.id) === id}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Detail — Outlet */}
      <div className={cn("flex-1 flex-col", id ? "flex" : "hidden md:flex")}>
        <Outlet
          context={{
            conversations,
            refreshConversations: fetchConversations,
            refreshTotalUnreadCount,
          }}
        />
      </div>
    </div>
  );
}

export default ConversationsLayout;

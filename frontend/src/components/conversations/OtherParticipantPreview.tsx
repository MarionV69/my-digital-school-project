import { useState } from "react";
import { ExternalLink, Globe, MapPin, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getEstablishmentPreview } from "@/api/establishments";
import type { EstablishmentPreview } from "@/types/establishments.types";
import type { Conversation } from "@/types/conversations.types";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import { useNavigate } from "react-router-dom";

type OtherParticipantPreviewProps = {
  conversation: Conversation;
};

function OtherParticipantPreview({
  conversation,
}: OtherParticipantPreviewProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<EstablishmentPreview | null>(null);
  const [loading, setLoading] = useState(false);

  const isRestaurant = user?.establishmentType === EstablishmentType.RESTAURANT;
  const { otherParticipant } = conversation;

  const handleOpen = async () => {
    setOpen(true);
    if (preview) return;

    setLoading(true);
    try {
      const data = await getEstablishmentPreview(otherParticipant.id);
      setPreview(data);
    } catch (error) {
      console.error("Error fetching establishment preview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-full p-1.5 transition-colors hover:bg-muted cursor-pointer"
        aria-label="Voir le profil"
      >
        <ExternalLink className="size-4 text-muted-foreground" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader className="border-b border-border px-8 pt-6">
            <SheetTitle className="font-semibold">
              Aperçu du {isRestaurant ? "fournisseur" : "restaurant"}
            </SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 px-4 py-3">
              {/* Avatar */}
              {otherParticipant.avatarUrl ? (
                <img
                  src={otherParticipant.avatarUrl}
                  alt={otherParticipant.name}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-muted">
                  <User className="size-8 text-muted-foreground" />
                </div>
              )}

              {/* Name */}
              <h2 className="text-center text-xl font-semibold text-foreground">
                {otherParticipant.name}
              </h2>

              {preview && (
                <div className="w-full space-y-2 border-t border-border pt-4">
                  {/* City */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span>{preview.city}</span>
                  </div>

                  {/* Website */}
                  {preview.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="size-4 shrink-0" />
                      <a
                        href={preview.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-foreground hover:underline"
                      >
                        {preview.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Button to view full profile — connected restaurant only */}
              {isRestaurant && (
                <Button
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/suppliers/${otherParticipant.id}`);
                  }}
                >
                  Voir le profil complet
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default OtherParticipantPreview;

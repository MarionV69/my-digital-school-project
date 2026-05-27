import CommonInfoSection from "@/components/profile/CommonInfoSection";
import SocialSection from "@/components/profile/SocialSection";
import SupplierExtras from "@/components/profile/SupplierExtras";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import useEstablishment from "@/hooks/useEstablishment";
import useSupplier from "@/hooks/useSupplier";
import ProfileProgress from "@/components/profile/supplier-extras/ProfileProgress";
import DocumentsSection from "@/components/documents/DocumentsSection";
import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import SupplierDetails from "@/components/supplier-details/SupplierDetails";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();
  const type = user?.establishmentType;
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    editionValues,
    setEditionValues,
    apiValues,
    loading,
    error,
    patchEstablishment,
    fieldErrors,
  } = useEstablishment();

  const {
    editionValues: supplierEditionValues,
    setEditionValues: supplierSetEditionValues,
    apiValues: supplierApiValues,
    loading: supplierLoading,
    error: supplierError,
    patchSupplier,
    fieldErrors: supplierFieldErrors,
  } = useSupplier();

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12 gap-6 flex flex-col max-w-7xl mx-auto w-full">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h3>Mon établissement</h3>
          {type === "SUPPLIER" && (
            <>
              <Button
                size="sm"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5"
              >
                <ExternalLink className="size-4" />
                Voir ma fiche
              </Button>

              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent
                  className="sm:max-w-6xl w-full max-h-[90vh] overflow-y-auto p-0"
                  showCloseButton={false}
                >
                  <DialogTitle className="sr-only">
                    Aperçu de ma fiche
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Aperçu de votre fiche fournisseur telle qu'elle apparaît aux
                    restaurants.
                  </DialogDescription>
                  <div className="relative rounded-xl overflow-hidden">
                    <button
                      onClick={() => setPreviewOpen(false)}
                      className="absolute top-4 right-2 z-50 mr-2 flex items-center justify-center size-8 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                    <SupplierDetails id={user?.establishmentId as number} />
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
        {type === "SUPPLIER" && (
          <div className="flex flex-col -space-y-5.5 ">
            <p className="text-muted-foreground max-w-10/12 lg:w-full">
              Complétez votre profil afin d'attirer des propsects.
            </p>
            <ProfileProgress
              editionValues={editionValues}
              supplierEditionValues={supplierEditionValues}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex flex-row w-full items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {error ? (
              <p>{error}</p>
            ) : (
              <>
                <CommonInfoSection
                  editionValues={editionValues}
                  setEditionValues={setEditionValues}
                  apiValues={apiValues}
                  patchEstablishment={patchEstablishment}
                  fieldErrors={fieldErrors}
                />
                <SocialSection
                  editionValues={editionValues}
                  setEditionValues={setEditionValues}
                  apiValues={apiValues}
                  patchEstablishment={patchEstablishment}
                  fieldErrors={fieldErrors}
                />
                <DocumentsSection />
              </>
            )}
          </div>
        )}
        {supplierLoading ? (
          <div className="flex flex-row w-full items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        ) : (
          <>
            {supplierError && type === "SUPPLIER" ? (
              <p className="text-destructive">{supplierError}</p>
            ) : (
              type === "SUPPLIER" && (
                <SupplierExtras
                  supplierEditionValues={supplierEditionValues}
                  supplierSetEditionValues={supplierSetEditionValues}
                  supplierApiValues={supplierApiValues}
                  patchSupplier={patchSupplier}
                  supplierFieldErrors={supplierFieldErrors}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

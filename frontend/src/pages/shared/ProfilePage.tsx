import CommonInfoSection from "@/components/profile/CommonInfoSection";
import SocialSection from "@/components/profile/SocialSection";
import SupplierExtras from "@/components/profile/SupplierExtras";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import useEstablishment from "@/hooks/useEstablishment";
import useSupplier from "@/hooks/useSupplier";
import ProfileProgress from "@/components/profile/supplier-extras/ProfileProgress";
import DocumentsSection from "@/components/documents/DocumentsSection";

export default function ProfilePage() {
  const { user } = useAuth();
  const type = user?.establishmentType;

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
        <h3>Mon établissement</h3>
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

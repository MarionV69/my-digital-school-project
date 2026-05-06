import CommonInfoSection from "@/components/profile/CommonInfoSection";
import SocialSection from "@/components/profile/SocialSection";
import SupplierExtras from "@/components/profile/SupplierExtras";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import useEstablishment from "@/hooks/useEstablishment";

export default function ProfilePage() {
  const {user} = useAuth();
  const type = user?.establishmentType;

  const {editionValues, setEditionValues, apiValues, loading, error, patchEstablishment, fieldErrors} = useEstablishment();

  // PATCH à chaque blur

  // événement onBlur={fielNamePatch} sur chaque <input>

  return (
    <div className="px-4 py-8 lg:py-12 lg:px-24 gap-6 flex flex-col">
      <div className="flex flex-col">
        <h3>Mon établissement</h3>
        {type === 'SUPPLIER' && <p className="text-muted-foreground">Complétez votre profil afin d'attirer des propsects.</p>}
      </div>
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
              {type === 'SUPPLIER' && <SupplierExtras />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
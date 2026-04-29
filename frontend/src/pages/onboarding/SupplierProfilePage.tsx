import StepHeader from "@/components/onboarding/StepHeader";
import SupplierProfileForm from "@/components/onboarding/SupplierProfileForm";

function SupplierProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        stepNumber={3}
        stepDescription="Profil fournisseur"
        title="Votre profil fournisseur"
      />
      <SupplierProfileForm />
    </div>
  );
}

export default SupplierProfilePage;

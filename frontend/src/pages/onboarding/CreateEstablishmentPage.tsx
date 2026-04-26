import CreateEstablishmentForm from "@/components/onboarding/CreateEstablishmentForm";
import StepHeader from "@/components/onboarding/StepHeader";

function CreateEstablishmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        stepNumber={2}
        stepDescription="Établissement"
        title="Votre établissement"
      />
      <CreateEstablishmentForm />
    </div>
  );
}

export default CreateEstablishmentPage;

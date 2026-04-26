import CreateEstablishmentForm from "@/components/onboarding/CreateEstablishmentForm";

function CreateEstablishmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Étape 2 - Votre établissement
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Votre établissement
        </h1>
      </div>
      <CreateEstablishmentForm />
    </div>
  );
}

export default CreateEstablishmentPage;

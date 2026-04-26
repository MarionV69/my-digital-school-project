import RegisterForm from "@/components/auth/RegisterForm";
import StepHeader from "@/components/onboarding/StepHeader";

function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        stepNumber={1}
        stepDescription="Votre compte"
        title="Créez votre compte"
      />
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;

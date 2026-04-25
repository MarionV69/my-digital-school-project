import RegisterForm from "@/components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-tracking-widest text-muted-foreground mb-1">
          Étape 1 - Votre compte
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Créer un compte
        </h1>
      </div>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;

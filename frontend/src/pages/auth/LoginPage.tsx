import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Connexion</h1>
      <LoginForm />
    </div>
  );
}
export default LoginPage;

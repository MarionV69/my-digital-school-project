import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="text-brand-dark max-w-md mx-auto p-5 bg-white rounded-lg shadow-lg mt-6">
      <h1 className="text-4xl my-6 text-center">Se connecter</h1>
      <LoginForm />
    </div>
  );
}
export default LoginPage;

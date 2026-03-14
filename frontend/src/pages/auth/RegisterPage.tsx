import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="text-brand-dark max-w-md mx-auto p-5 bg-white rounded-lg shadow-lg mt-6">
      <h1 className="text-4xl my-6 text-center">Créer votre compte</h1>
      <RegisterForm />
    </div>
  );
}
export default RegisterPage;

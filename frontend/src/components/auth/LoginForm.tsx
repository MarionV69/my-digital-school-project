import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { isEmailValid, isNotEmptyString } from "../../utils/validation";
import Input from "../common/Input";
import { EstablishmentType } from "../../types/establishments.types";

type LoginFormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    // Reset errors
    setErrors({});

    // Validate form data
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!isNotEmptyString(email)) {
      newErrors.email = "L'email est requis";
    } else if (!isEmailValid(email)) {
      newErrors.email = "Email invalide";
    }

    // Password validation
    if (!isNotEmptyString(password)) {
      newErrors.password = "Le mot de passe est requis.";
    }

    // If errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit registration
    setIsLoading(true);

    try {
      const user = await login(email, password);

      toast.success(`Bienvenue ${user.firstName} !`);

      // Redirect based on establishment type
      if (!user.establishmentId) {
        navigate("/onboarding/create-establishment");
      } else if (user.establishmentType === EstablishmentType.RESTAURANT) {
        navigate("/restaurant/dashboard");
      } else if (user.establishmentType === EstablishmentType.SUPPLIER) {
        navigate("/supplier/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrors({ general: "Email ou mot de passe incorrect" });
      } else {
        toast.error("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errors.general && (
        <p className="text-red-600 text-center mb-4">{errors.general}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto"
        noValidate
      >
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
          error={errors.email}
        />

        <div className="relative">
          <Input
            label="Mot de passe"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            error={errors.password}
          />
          <span
            className="text-sm cursor-pointer absolute right-4 top-11 text-brand-light"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Masquer" : "Afficher"}
          </span>
        </div>

        <button type="submit" disabled={isLoading} className="btn my-4 mx-auto">
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-center">
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="underline text-brand-dark font-semibold"
        >
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
export default LoginForm;

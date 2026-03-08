import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  isEmailValid,
  isNotEmptyString,
  validatePassword,
} from "../../utils/validation";
import Input from "../common/Input";

type RegisterFormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Reset errors
    setErrors({});

    // Validate form data
    const newErrors: RegisterFormErrors = {};

    // First name and last name validation
    if (!isNotEmptyString(firstName)) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!isNotEmptyString(lastName)) {
      newErrors.lastName = "Le nom est requis";
    }

    // Email validation
    if (!isNotEmptyString(email)) {
      newErrors.email = "L'email est requis";
    } else if (!isEmailValid(email)) {
      newErrors.email = "Email invalide";
    }

    // Password validation
    if (!isNotEmptyString(password)) {
      newErrors.password = "Le mot de passe est requis.";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    }

    // Confirm password validation
    if (!isNotEmptyString(confirmPassword)) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // If errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit registration
    setIsLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        role: "OWNER",
      });

      toast.success("Inscription réussie, bienvenue !");
      navigate("/onboarding/create-establishment");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrors({ email: "Cet email est déjà utilisé" });
      } else {
        toast.error("Une erreur est survenue lors de l'inscription");
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
          label="Prénom"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          disabled={isLoading}
          required
          error={errors.firstName}
        />
        <Input
          label="Nom"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          disabled={isLoading}
          required
          error={errors.lastName}
        />
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
          <small>
            Minimum 12 caractères dont 1 majuscule, 1 chiffre et 1 caractère
            spécial
          </small>
          <span
            className="text-sm cursor-pointer absolute right-4 top-11 text-brand-light"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Masquer" : "Afficher"}
          </span>
        </div>
        <div className="relative">
          <Input
            label="Confirmer le mot de passe"
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
            error={errors.confirmPassword}
          />
          <span
            className="text-sm cursor-pointer absolute right-4 top-11 text-brand-light"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showPassword ? "Masquer" : "Afficher"}
          </span>
        </div>

        <button type="submit" disabled={isLoading} className="btn my-4 mx-auto">
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <p className="text-center">
        Déjà un compte ?{" "}
        <Link to="/login" className="underline text-brand-dark font-semibold">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;

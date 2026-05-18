import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { isEmailValid, isNotEmptyString } from "../../utils/validation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EstablishmentType } from "@/types/establishments.types";

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
      newErrors.email = "L'email est requis.";
    } else if (!isEmailValid(email)) {
      newErrors.email = "Email invalide.";
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

      // Redirect based on establishment
      if (!user.establishmentId) {
        navigate("/onboarding/create-establishment");
      } else if (user.establishmentType === EstablishmentType.RESTAURANT) {
        navigate("/");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrors({ general: "Email ou mot de passe incorrect." });
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
        <p className="text-destructive text-center mb-2">{errors.general}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <FieldGroup>
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Adresse e-mail</FieldLabel>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.fr"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                autoFocus
                aria-invalid={!!errors.email}
                className="pr-10"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <FieldError>{errors.email}</FieldError>
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.password}</FieldError>
          </Field>
        </FieldGroup>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full mt-3">
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      {/* Separator + register link */}
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/50" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-background px-2">
            Nouveau sur le bon fournisseur ?
          </span>
        </div>
      </div>

      <p className="text-center text-sm mt-2">
        <Link
          to="/register"
          className="font-medium text-primary-mid hover:primary"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;

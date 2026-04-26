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
import { Eye, EyeOff, Mail } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

type RegisterFormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
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
    acceptTerms: false,
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
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    } = formData;

    // Reset errors
    setErrors({});

    const newErrors: RegisterFormErrors = {};

    // First name and last name validation
    if (!isNotEmptyString(firstName)) {
      newErrors.firstName = "Le prénom est requis.";
    }
    if (!isNotEmptyString(lastName)) {
      newErrors.lastName = "Le nom est requis.";
    }

    // Email validation
    if (!isNotEmptyString(email)) {
      newErrors.email = "L'email est requis.";
    } else if (!isEmailValid(email)) {
      newErrors.email = "Email invalide.";
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
      newErrors.confirmPassword =
        "La confirmation du mot de passe est requise.";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    // Accept terms validation
    if (!acceptTerms) {
      newErrors.acceptTerms =
        "Vous devez accepter les conditions d'utilisation.";
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
        acceptTerms,
      });

      navigate("/onboarding/create-establishment");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrors({ email: "Cet email est déjà utilisé." });
      } else {
        toast.error("Une erreur est survenue lors de l'inscription.");
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
          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.firstName}>
              <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Marie"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                autoFocus
                aria-invalid={!!errors.firstName}
              />
              <FieldError>{errors.firstName}</FieldError>
            </Field>

            <Field data-invalid={!!errors.lastName}>
              <FieldLabel htmlFor="lastName">Nom</FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.lastName}
              />
              <FieldError>{errors.lastName}</FieldError>
            </Field>
          </div>

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
                aria-invalid={!!errors.email}
                className="pr-10"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <FieldError>{errors.email}</FieldError>
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
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
            <FieldDescription>
              Minimum 12 caractères dont 1 majuscule, 1 chiffre et 1 caractère
              spécial
            </FieldDescription>
            <FieldError>{errors.password}</FieldError>
          </Field>

          {/* Confirm password */}
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              Confirmer le mot de passe
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.confirmPassword}</FieldError>
          </Field>

          {/* CGU */}
          <Field data-invalid={!!errors.acceptTerms} orientation="horizontal">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({ ...prev, acceptTerms: !!checked }));
                if (errors.acceptTerms) {
                  setErrors((prev) => ({ ...prev, acceptTerms: undefined }));
                }
              }}
              disabled={isLoading}
              aria-invalid={!!errors.acceptTerms}
            />
            <FieldLabel
              htmlFor="acceptTerms"
              className="font-normal text-sm leading-snug"
            >
              <span>
                J'accepte les{" "}
                <Link
                  to="/terms"
                  className="text-primary-mid underline hover:text-primary"
                >
                  conditions générales d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/privacy"
                  className="text-primary-mid underline hover:text-primary"
                >
                  politique de confidentialité
                </Link>
              </span>
            </FieldLabel>
            <FieldError>{errors.acceptTerms}</FieldError>
          </Field>
        </FieldGroup>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full mt-3">
          {isLoading ? "Inscription..." : "Continuer"}
        </Button>
      </form>

      {/* Separator + login link */}
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/50" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-background px-2">Déjà membre ?</span>
        </div>
      </div>

      <p className="text-center text-sm mt-3">
        <Link
          to="/login"
          className="font-medium text-foreground hover:underline"
        >
          Connexion
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;

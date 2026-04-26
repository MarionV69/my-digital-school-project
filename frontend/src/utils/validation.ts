// Returns true if the value is a non-empty string
export function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function isEmailValid(email: string): boolean {
  // Simple email regex for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Returns an error message if the password is invalid, or null if it's valid
export function validatePassword(password: string): string | null {
  if (password.length < 12) {
    return "Le mot de passe doit contenir au moins 12 caractères.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins 1 lettre majuscule.";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins 1 chiffre.";
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins 1 caractère spécial.";
  }
  return null;
}

// Returns true if the SIRET contains exactly 14 digits (spaces ignored)
export function isSiretValid(siret: string): boolean {
  return /^\d{14}$/.test(siret.replace(/\s/g, ""));
}

// Returns true if the postal code is valid (5 digits for France)
export function isPostalCodeValid(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode.replace(/\s/g, ""));
}

// Returns true if the phone number is valid for France
export function isPhoneValid(phone: string): boolean {
  const normalized = phone.replace(/[\s\-().]/g, "");
  return /^(\+33|0)[1-9]\d{8}$/.test(normalized);
}

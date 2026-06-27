import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { deleteAccount, updateProfile } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import toast from "react-hot-toast";

function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(formData);
      await refreshUser();
      toast.success("Informations mises à jour.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      logout();
      navigate("/");
      toast.success("Votre compte a été supprimé.");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Une erreur est survenue lors de la suppression du compte.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <h1 className="text-2xl">Paramètres</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-3">
          Modifier mes informations
        </h2>
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
          <FieldGroup>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
                <FieldError />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
                <FieldError />
              </Field>
            </div>
          </FieldGroup>
          <div>
            <Button type="submit" disabled={isUpdating} size="lg">
              {isUpdating ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-3">Supprimer mon compte</h2>
        <p className="text-sm text-muted-foreground">
          Cette action est irréversible. Votre compte et toutes les données
          associées seront définitivement supprimés.
        </p>

        {confirm && (
          <p className="text-sm text-destructive font-medium">
            Êtes-vous sûr ? Cliquez à nouveau pour confirmer la suppression.
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            size="lg"
          >
            {isDeleting
              ? "Suppression..."
              : confirm
                ? "Confirmer la suppression"
                : "Supprimer mon compte"}
          </Button>

          {confirm && (
            <Button
              variant="outline"
              onClick={() => setConfirm(false)}
              disabled={isDeleting}
              size="lg"
            >
              Annuler
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;

import type { filtersType } from "@/types/filters.types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useAuth } from "@/hooks/useAuth";

type FiltersProps = {
  filters: filtersType;
  onChange: (filters: filtersType) => void;
};

export default function Filters({ filters, onChange }: FiltersProps) {
  const { user } = useAuth();

  // Fonction pour ajouter ou retirer une catégorie des filtres
  const CATEGORIES = [
    "Viandes",
    "Fruits & légumes",
    "Poissons & Produits de la mer",
    "Produits laitiers & oeufs",
    "Boulangerie / Pâtisserie",
    "Épicerie sèche",
    "Produits surgelés",
    "Boissons",
  ];

  function handleChangeCategory(category: string, checked: boolean) {
    if (checked) {
      onChange({
        ...filters,
        productCategories: [...filters.productCategories, category],
      });
    } else {
      onChange({
        ...filters,
        productCategories: [
          ...filters.productCategories.filter((c) => c !== category),
        ],
      });
    }
  }

  // Fonction pour ajouter ou retire un label des filtres
  const LABELS = ["Bio", "Label Rouge", "AOP", "IGP", "HVE", "Origine France"];

  function handleChangeLabel(label: string, checked: boolean) {
    if (checked) {
      onChange({ ...filters, labels: [...filters.labels, label] });
    } else {
      onChange({
        ...filters,
        labels: [...filters.labels.filter((l) => l !== label)],
      });
    }
  }

  // Fonction pour déterminer la note minimale
  const RATINGS = [
    { label: "5 étoiles", value: 5 },
    { label: "4 étoiles et +", value: 4 },
    { label: "3 étoiles et +", value: 3 },
    { label: "Toutes les notes", value: 0 },
  ];

  // Fonction pour ajouter ou retirer une tranche prix des filtres
  const PRICE_RANGE = [
    {label: "Économique", value: "ECONOMIC"},
    {label: "Milieu de gamme", value: "MID_RANGE"},
    {label: "Premium", value: "PREMIUM"}
  ];

  function handleChangePriceRange(priceRange: string, checked: boolean) {
    if (checked) {
      onChange({
        ...filters,
        priceRange: [...filters.priceRange, priceRange],
      });
    } else {
      onChange({
        ...filters,
        priceRange: [
          ...filters.priceRange.filter((p) => p !== priceRange),
        ],
      });
    }
  }

  // Fonction pour réinitialiser les filtres
  function handleReset() {
    onChange({
      productCategories: [],
      labels: [],
      minRating: 0,
      priceRange: [],
      isPremium: false,
    });
  }

  function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')      // remplace tout caractère non alphanumérique par un tiret
    .replace(/(^-|-$)/g, '');         // enlève les tirets en début/fin
}

  return (
    <div className="flex flex-col gap-6 w-1.5/6">
      {!user && (
        <Card>
          <h4>Vous êtes fournisseur ?</h4>
          <p className="text-muted-foreground">
            Référencez votre entreprise et accédez à des milliers de
            restaurateurs.
          </p>
          <Link to="/register" className="w-full">
            <Button variant="outline" className="w-full">
              Créer mon profil
            </Button>
          </Link>
        </Card>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground">CATÉGORIES</p>
          {CATEGORIES.map((category) => (
            <Field key={category} orientation="horizontal">
              <Checkbox
                checked={filters.productCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleChangeCategory(category, checked as boolean)
                }
                id={category}
                name={category}
                data-testid={`filter-category-${slugify(category)}`}
              />
              <FieldLabel htmlFor={category} className="font-normal text-sm">
                {category}
              </FieldLabel>
            </Field>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground">LABELS</p>
          {LABELS.map((label) => (
            <Field key={label} orientation="horizontal">
              <Checkbox
                checked={filters.labels.includes(label)}
                onCheckedChange={(checked) =>
                  handleChangeLabel(label, checked as boolean)
                }
                id={label}
                name={label}
              />
              <FieldLabel className="font-normal text-sm" htmlFor={label}>
                {label}
              </FieldLabel>
            </Field>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground">NOTE</p>
          <RadioGroup
            value={String(filters.minRating)}
            onValueChange={(value) =>
              onChange({ ...filters, minRating: Number(value) })
            }
            className="gap-1"
          >
            {RATINGS.map((rating) => (
              <div
                key={rating.label}
                className="flex flex-row items-center gap-1"
              >
                <RadioGroupItem
                  value={String(rating.value)}
                  id={rating.label}
                />
                <label htmlFor={rating.label} className="font-normal text-sm">
                  {rating.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Separator />
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground">PRIX</p>
          {PRICE_RANGE.map(({label, value}) => (
            <Field key={value} orientation="horizontal">
              <Checkbox
                checked={filters.priceRange.includes(value)}
                onCheckedChange={(checked) =>
                  handleChangePriceRange(value, checked as boolean)
                }
                id={value}
                name={value}
              />
              <FieldLabel
                htmlFor={value}
                className="font-normal text-sm"
              >
                {label}
              </FieldLabel>
            </Field>
          ))}
        </div>
        <Separator />
        <div className="flex flex-row items-center gap-1">
          <label className="font-normal text-sm">Premium uniquement</label>
          <Switch
            checked={filters.isPremium}
            onCheckedChange={(checked) =>
              onChange({ ...filters, isPremium: checked })
            }
          />
        </div>
        <Button variant="ghost" onClick={handleReset} className="justify-start">
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
}

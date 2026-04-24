import type { filtersType } from "@/types/filters";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

type FiltersProps = {
    filters: filtersType;
    onChange: (filters: filtersType) => void
}

export default function Filters({filters, onChange}: FiltersProps) {

    function handleChangeCategory(category: string, checked: boolean) {
        if(checked) {
            onChange({...filters, productCategories: [...filters.productCategories, category]});
        } else {
            onChange({...filters, productCategories: [...filters.productCategories.filter(c => c !== category)]})
        }
    }

    return(
        <div className="flex flex-col gap-3 w-2/6">
            <Card>
                <h4>Vous êtes fournisseur ?</h4>
                <p className="text-card-foreground">Référencez votre entreprise et accédez à des milliers de restaurateurs.</p>
                <Button variant="outline">Créer mon profil</Button>
            </Card>
            <div className="flex flex-col gap-1">
                <p className="text-muted-foreground">CATÉGORIES</p>
                <FieldGroup className="flex flex-col gap-1.5">
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Viandes")}
                            onCheckedChange={(checked) => handleChangeCategory("Viandes", checked as boolean)} 
                            id="meat" 
                            name="meat-checkbox" />
                        <FieldLabel htmlFor="meat-checkbox">
                            Viandes
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Fruits & légumes")}
                            onCheckedChange={(checked) => handleChangeCategory("Fruits & légumes", checked as boolean)} 
                            id="vegetables" 
                            name="vegetables-checkbox" />
                        <FieldLabel htmlFor="vegetables-checkbox">
                            Fruits & Légumes
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Poissons & Produits de la mer")}
                            onCheckedChange={(checked) => handleChangeCategory("Poissons & Produits de la mer", checked as boolean)} 
                            id="fish" 
                            name="fish-checkbox" />
                        <FieldLabel htmlFor="fish-checkbox">
                            Poissons & Produits de la mer
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Produits laitiers & oeufs")}
                            onCheckedChange={(checked) => handleChangeCategory("Produits laitiers & oeufs", checked as boolean)}
                            id="milk" 
                            name="milk-checkbox" />
                        <FieldLabel htmlFor="milk-checkbox">
                            Produits laitiers & oeufs
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Boulangerie / Pâtisserie")}
                            onCheckedChange={(checked) => handleChangeCategory("Boulangerie / Pâtisserie", checked as boolean)}
                            id="bread" 
                            name="bread-checkbox" />
                        <FieldLabel htmlFor="bread-checkbox">
                            Boulangerie / Pâtisserie
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Épicerie sèche")}
                            onCheckedChange={(checked) => handleChangeCategory("Épicerie sèche", checked as boolean)}
                            id="grocery" 
                            name="grocery-checkbox" />
                        <FieldLabel htmlFor="grocery-checkbox">
                            Épicerie sèche
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Produits surgelés")}
                            onCheckedChange={(checked) => handleChangeCategory("Produits surgelés", checked as boolean)}
                            id="frozen" 
                            name="frozen-checkbox" />
                        <FieldLabel htmlFor="frozen-checkbox">
                            Produits surgelés
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox 
                            checked={filters.productCategories.includes("Boissons")}
                            onCheckedChange={(checked) => handleChangeCategory("Boissons", checked as boolean)}
                            id="drinks" 
                            name="drinks-checkbox" />
                        <FieldLabel htmlFor="drinks-checkbox">
                            Boissons
                        </FieldLabel>
                    </Field>
                </FieldGroup>
            </div>
        </div>
    )


}
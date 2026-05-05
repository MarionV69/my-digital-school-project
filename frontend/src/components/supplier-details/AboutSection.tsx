import type { supplierDetails } from "@/types/supplierDetails.type"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

type SupplierProps = {
    supplier: supplierDetails,
}

export default function AboutSection({supplier}: SupplierProps) {
    return(
    <Accordion type="single" collapsible>
      <AccordionItem value="about">
        <AccordionTrigger>
          À propos
        </AccordionTrigger>
        <AccordionContent className="p-6">
            {supplier.description ? <p>{supplier.description}</p> : <p>Aucune description renseignée par le fournisseur.</p>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    )
}
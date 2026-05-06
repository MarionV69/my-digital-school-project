import type { supplierDetails } from "@/types/supplierDetails.type"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card } from "../ui/card"

type SupplierProps = {
    supplier: supplierDetails,
}

export default function InfoSection({supplier}: SupplierProps) {
    return(
    <Accordion type="single" collapsible>
      <AccordionItem value="about">
        <AccordionTrigger>
          Informations pratiques
        </AccordionTrigger>
        <AccordionContent className="p-6 flex  flex-col lg:flex-row gap-2 items-start h-auto">
            {supplier.minimumOrderAmount 
                && (
                    <Card className="w-full gap-2 h-auto bg-white border-1">
                        <p className="text-muted-foreground">COMMANDE MINIMUM</p>
                        <p>{Number(supplier.minimumOrderAmount).toFixed(0)}€</p>
                    </Card>
                )
            }
            {supplier.deliveryRadiusKm 
                && (
                    <Card className="w-full gap-2 h-auto bg-white border-1">
                        <p className="text-muted-foreground">ZONE DE LIVRAISON</p>
                        <p>{supplier.deliveryRadiusKm}km autour de {supplier.city}</p>
                    </Card>
                )
            }  
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    )
}
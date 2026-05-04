import type { supplierDetails } from "@/types/supplierDetails.type"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card, CardContent } from "../ui/card"

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
                    <Card className="w-full">
                        <CardContent>
                            <p className="text-muted-foreground font-medium">COMMANDE MINIMUM</p>
                            <p>{Number(supplier.minimumOrderAmount).toFixed(0)}€</p>
                        </CardContent>
                    </Card>
                )
            }
            {supplier.deliveryRadiusKm 
                && (
                    <Card className="w-full">
                        <CardContent className="h-auto">
                            <p className="text-muted-foreground font-medium">ZONE DE LIVRAISON</p>
                            <p>{supplier.deliveryRadiusKm}km autour de {supplier.city}</p>
                        </CardContent>
                    </Card>
                )
            }  
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    )
}
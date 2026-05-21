import type { supplierDetails } from "@/types/supplierDetails.type";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

type GallerySectionType = {
  supplier: supplierDetails;
};

export default function GallerySection({ supplier }: GallerySectionType) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="gallery">
        <AccordionTrigger>Galerie</AccordionTrigger>
        <AccordionContent className="p-6 flex  flex-col lg:flex-row gap-2 items-start h-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {supplier.galleryPhotos.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
            </div>
            
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

import type { supplierDetails } from "@/types/supplierDetails.type";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ExternalLink } from "lucide-react";

type FilesSectionType = {
  supplier: supplierDetails;
};

export default function FilesSection({ supplier }: FilesSectionType) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="files">
        <AccordionTrigger>Documents</AccordionTrigger>
        <AccordionContent className="p-6 flex flex-col gap-3 h-auto">
          {supplier.catalogs.map((catalog) => (
            <a key={catalog.id} href={catalog.url} target="_blank" rel="noreferrer" className="![text-decoration:none]">
              <div className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium flex-1">{catalog.originalFilename}</span>
                <span className="text-xs text-muted-foreground">
                  {(catalog.size / 1024).toFixed(0)} Ko
                </span>
                <ExternalLink size={16} className="text-muted-foreground" />
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
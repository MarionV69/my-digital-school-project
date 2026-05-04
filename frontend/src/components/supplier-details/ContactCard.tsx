import type { supplierDetails } from "@/types/supplierDetails.type"
import truncate from "@/utils/truncate";
import { Globe } from "lucide-react";
import { Link } from "react-router";

type ContactCardProps = {
    supplier: supplierDetails,
};

export default function ContactCard({supplier}: ContactCardProps) {

    return(
        <div className="w-full lg:w-3/12 flex flex-col p-6 gap-2 border-2 border-border rounded-lg">
            <p className="text-muted-foreground font-medium">RETROUVEZ-NOUS</p>
            {supplier.website && (
                <Link to={supplier.website}>
                    <div className="flex flex-row gap-2 group">
                        <div className="p-2 rounded-lg bg-border h-max group-hover:bg-primary/10 transition-colors duration-300">
                            <Globe className="w-4 h-4" />
                        </div>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors duration-300">{truncate(supplier.website, 20)}</p>
                    </div>
                </Link>
            )}
            {supplier.facebook && (
                <Link to={supplier.facebook}>
                    <div className="flex flex-row gap-2 group">
                        <div className="p-2 rounded-lg bg-border h-max group-hover:bg-primary/10 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>
                        </div>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors duration-300">{truncate(supplier.facebook, 20)}</p>
                    </div>
                </Link>
            )}
            {supplier.instagram && (
                <Link to={supplier.instagram}>
                    <div className="flex flex-row gap-2 group">
                        <div className="p-2 rounded-lg bg-border h-max group-hover:bg-primary/10 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                            </svg>
                        </div>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors duration-300">{truncate(supplier.instagram , 20)}</p>
                    </div>
                </Link>
            )}
        </div>
    )
}
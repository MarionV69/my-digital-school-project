import { MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useState, type ChangeEvent } from "react";

type SearchBarProps = {
    onSearch: (search: string, city: string) => void
}

export default function SearchBar({onSearch}: SearchBarProps) {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");

    // Fonction déclenchée au moment du changement de l'input pour le nom du restaurateur
    function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
    }

    // Fonction déclenchée au moment du changement de l'input du lieu
    function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
        setCity(e.target.value)
    }

    // Fonction permettant de déclencher onSubmit à l'appui sur la touche Entrée
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") onSubmit();
    }

    // Fonction déclenchée au moment du clic sur Rechercher
    function onSubmit() {
        onSearch(search, city);
    }

    return(
        <div className="flex flex-row justify-between items-center bg-card/80 w-full rounded-lg group transition-colors duration-1000 hover:bg-card">

            {/* Champ : nom du fournisseur */}
            <div className="flex flex-row gap-2 px-4 w-full items-center">
                <Search size={16} className="text-muted-foreground transition-trasnform duration-1000 group-hover:scale-110"></Search>
                <input
                    type="text"
                    placeholder="Nom du fournisseur"
                    value={search}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    className="text-card-foreground placeholder-muted-foreground  outline-none w-full">
                </input>
            </div>

            <div className="flex flex-row gap-3 relative">

                {/* Séparateur vertical */}
                <div className="w-px bg-muted-foreground/20"></div>

                {/* Champ: localisation */}
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary"></MapPin>
                    <input
                        type="text"
                        value={city}
                        onChange={handleLocationChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ville"
                        className="text-card-foreground placeholder-muted-foreground  outline-none">
                    </input>
                </div>

                {/* Boutton Rechercher */}
                <Button className="rounded-l-none"
                    onClick={onSubmit}
                >Rechercher</Button>
                
            </div>

        </div>
    )



}


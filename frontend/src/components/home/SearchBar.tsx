import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useState, type ChangeEvent } from "react";

type SearchBarProps = {
    onSearch: (search: string, city: string) => void;
    onFilterOpen: () => void;
}

export default function SearchBar({onSearch, onFilterOpen}: SearchBarProps) {
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
        <div className="flex flex-row gap-2">
            <div className="flex flex-row justify-between items-center bg-card/80 rounded-lg group transition-colors duration-1000 hover:bg-card w-full">

                {/* Champ : nom du fournisseur */}
                <div className="flex flex-row gap-2 px-4 items-center w-full">
                    <Search size={16} className="text-muted-foreground transition-transform duration-1000 group-hover:scale-110 hidden lg:block"></Search>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={search}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        className="text-card-foreground placeholder-muted-foreground outline-none w-full">
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
                            className="text-card-foreground placeholder-muted-foreground  outline-none w-12 lg:w-auto">
                        </input>
                    </div>

                    {/* Boutton Rechercher */}
                    <Button 
                        className="hidden lg:flex rounded-l-none"
                        onClick={onSubmit}>
                        Rechercher
                    </Button>
                    <Button
                        className="flex lg:hidden rounded-l-none"
                        onClick={onSubmit}>
                        <Search size={18} />
                    </Button>
                </div>
            </div>
            {/* Bouton pour ouvrir les filtres sur mobile */}
            <button className="lg:hidden p-2" onClick={onFilterOpen}>
                <SlidersHorizontal size={18} className="text-muted-foreground" />
            </button>
        </div>
    )



}


import { MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface SearchBarProps {
    onSearch: (query: string, location: string) => void;
}

// J'ai mis en place un système de suggestion pour la localisation: quand l'utilisateur tape dans le champ de localisation, le composant va interroger une API externe (Nominatim, qui est l'API de OpenStreetMap) pour obtenir une liste de villes correspondantes, puis les afficher sous forme de liste cliquable.
interface CitySuggestion {
    place_id: number;
    display_name: string;
}

export default function SearchBar({ onSearch } : SearchBarProps) {

    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("Lyon, 69000");
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Le debounce évite de faire un appel API à chaque lettre tapée
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Ferme la liste de suggestions si on clique en dehors
    useEffect(() => {
        function handleCLickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleCLickOutside);
        return () => document.removeEventListener("mousedown", handleCLickOutside);
    }, []);

    // Appel Nominatim avec debounce (400ms après la dernière frappe)
    function handleLocationChange(value: string) {
        setLocation(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        if(value.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch (
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=fr&addressdetails=1`,
                    { headers: { "Accept-Language": "fr" } }
                );
                const data: CitySuggestion[] = await res.json();
                setSuggestions(data)
                setShowSuggestions(data.length > 0);
            } catch {
                setSuggestions([]);
            }
        }, 400);
    }

    function handleSelectSuggestion(suggestion: CitySuggestion) {
        const shortName = suggestion.display_name.split(",").slice(0, 2).join(",").trim();
        setLocation(shortName);
        setSuggestions([]);
        setShowSuggestions(false);
    }

    // Fonction déclenché au moment du clic sur Rechercher
    function onSubmit() {
        setShowSuggestions(false);
        onSearch(query, location);
    }

    // Fonction permettant de déclencher onSubmit à l'appui sur la touche Entrée
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") onSubmit();
    }

    return(
        <div className="flex flex-row justify-between items-center bg-card w-full rounded-lg">

            {/* Champ : nom du fournisseur */}
            <div className="flex flex-row gap-3 py-2.5 px-4 w-full">
                <Search size={18} className="text-muted-foreground"></Search>
                <input
                    type="text"
                    placeholder="Nom du fournisseur"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-card-foreground placeholder-muted-foreground  outline-none w-full">
                </input>
            </div>

            <div className="flex flex-row gap-3 px-2.5 relative" ref={wrapperRef}>

                {/* Séparateur vertical */}
                <div className="w-px bg-muted-foreground/50"></div>

                {/* Champ: localisation */}
                <div className="flex items-center gap-1">
                    <MapPin size={18} className="text-primary"></MapPin>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="Ville ou code postal"
                        className="text-card-foreground placeholder-muted-foreground  outline-none">
                    </input>
                </div>

                {showSuggestions && (
                    <ul className="absolute left-0 top-full right-0 bg-white border border-card rounded-lg shadow lg z-50 overflow-hidden">
                        {suggestions.map((s) => {
                            const parts = s.display_name.split(",");
                            const city = parts[0].trim()
                            const region = parts.slice(1, 3).join(",").trim();
                            return(
                                <li
                                    key={s.place_id}
                                    onMouseDown={() => handleSelectSuggestion(s)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted-foreground/50 cursor-pointer"
                                >
                                    <MapPin size={13} className="text-muted-foreground"></MapPin>
                                    <span className="text-card-foreground">{city}</span>
                                    <span className="text-muted-foreground text-sm">{region}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Boutton Rechercher */}
                <Button
                    onClick={onSubmit}
                >Rechercher</Button>
                
            </div>

        </div>
    )



}



import SearchBar from "@/components/home/SearchBar";
import api from "@/lib/axios";
import { User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Supplier {
  id: number;
  name: string;
  city: string;
  postalCode: string;
  priceRange: string;
  isPremium: boolean;
  labels: string[];
  productCategories: string[];
  logoUrl: string;
  coverPhotoUrl: string;
  reviewsCount: number;
  averageRating: number;
}

function HomePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  async function handleSearch(query: string, location: string){
    const params : Record<string, string> = {};
    if (query) params.query = query;
    if (location) params.city = location.split(",")[0].trim();

    // GET /suppliers?query=boucherie&location=Lyon
    const response = await api.get("/suppliers", {params});
    setSuppliers(response.data);
    console.log("Résultats :", response.data);
  }

  return (
    <div>
      <h1>HomePage</h1>
      <Link to="/login" className="btn">
        <User />
        Se connecter
      </Link>
      <SearchBar onSearch={handleSearch}>

      </SearchBar>
    </div>
  );
}
export default HomePage;

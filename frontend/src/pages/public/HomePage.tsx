
import api from "@/api/axiosConfig";
import SearchBar from "@/components/home/SearchBar";
import type { Supplier } from "@/types/supplier";
import { User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


function HomePage() {
  const [, setSuppliers] = useState<Supplier[]>([]);

 async function handleSearch(search: string, city: string) {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (city) params.city = city;

    try {
      const response = await api.get('/suppliers', {params});
      console.log("Réponse reçue : ", response.data)
      setSuppliers(response.data)
    } catch (error) {
      console.error("Erreur : " , error)
    }
}
    
  
  return (
    <div className="p-10">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
export default HomePage;

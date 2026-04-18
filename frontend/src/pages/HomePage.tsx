import SearchBar from "@/components/home/SearchBar";
import axios from "axios";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {

  function handleSearch(query: string, location: string){
    const params : Record<string, string> = {};
    if (query) params.query = query;
    if (location) params.location = location;

    // GET /suppliers?query=boucherie&location=Lyon
    axios.get("/suppliers", {params});
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

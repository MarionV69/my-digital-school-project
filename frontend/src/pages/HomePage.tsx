
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"

function HomePage() {
  return (
    <div>
      <h1>HomePage</h1>
      <Link to="/login" className="btn">
        <User />
        Se connecter
      </Link>
    </div>
  );
}
export default HomePage;

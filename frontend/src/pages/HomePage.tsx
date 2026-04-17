
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
      <div className="p-8 flex flex-col gap-4">
        <h1>Titre Helvetica</h1>
        <p>Texte body normal</p>
        <p className="text-muted-foreground">Texte secondaire</p>
        <Button>Bouton primary</Button>
        <Input placeholder="Exemple input" />
        <Card className="p-4">Contenu d'une card</Card>
        <Badge variant="outline">Badge test</Badge>
      </div>
      
    </div>
  );
}
export default HomePage;

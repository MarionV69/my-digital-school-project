import { User } from "lucide-react";
import { Link } from "react-router-dom";

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

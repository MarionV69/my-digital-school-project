import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LogOutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    toast.success("Vous avez été déconnecté avec succès.");
    navigate("/");
  };

  return (
    <button onClick={handleLogOut} className="btn btn-ghost">
      <LogOut />
      <span className="sr-only">Déconnexion</span>
      <span className="hidden sm:inline">Se déconnecter</span>
    </button>
  );
}
export default LogOutButton;

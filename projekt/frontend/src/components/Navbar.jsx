import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Wylogowano", "success");
    navigate("/");
  };

  return (
    <nav className="flex justify-between p-4 border-b">
      <Link to="/">
        <h1 className="font-bold text-lg hover:underline">ZaKólkiem</h1>
      </Link>
      <div className="space-x-2">
        {isLoggedIn ? (
          <Button onClick={handleLogout}>Wyloguj</Button>
        ) : (
          <>
            <Button asChild>
              <Link to="/login">Zaloguj</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Zarejestruj</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

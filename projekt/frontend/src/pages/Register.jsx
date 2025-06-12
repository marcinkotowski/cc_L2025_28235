import { useState } from "react";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !pass || !pass2) {
      showToast("Wypełnij wszystkie pola", "error");
      return;
    }

    if (pass !== pass2) {
      showToast("Hasła nie są takie same", "error");
      return;
    }

    try {
      await api.post("/auth/register", { email, password: pass });
      showToast("Zarejestrowano pomyślnie", "success");
      navigate("/login");
    } catch (e) {
      showToast("Błąd podczas rejestracji", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-4">
      <h1 className="text-3xl font-bold mb-6">Rejestracja</h1>
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Hasło"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Powtórz hasło"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
        />
        <Button type="submit">Zarejestruj się</Button>
      </form>
    </div>
  );
}

import { useState } from "react";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";

export default function Login() {
  console.log("Wynik: VITE_BASEURL:", import.meta.env.VITE_BASEURL);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      showToast("Wypełnij wszystkie pola", "error");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { email, password: pass });
      login({
        token: data.token,
        userId: data.userId,
        is_admin: data.is_admin,
      });
      showToast("Zalogowano pomyślnie", "success");
      navigate("/");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          showToast("Niepoprawny email lub hasło", "error");
        } else {
          showToast("Błąd serwera. Spróbuj ponownie później.", "error");
        }
      } else {
        showToast("Brak połączenia z serwerem", "error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-4">
      <h1 className="text-3xl font-bold mb-6">Logowanie</h1>
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
        <Button type="submit">Zaloguj się</Button>
      </form>
    </div>
  );
}

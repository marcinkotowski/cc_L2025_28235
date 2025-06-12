import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "../utils/toast"; // dopasuj ścieżkę jeśli trzeba

export default function Home() {
  const [nr, setNr] = useState("");
  const navigate = useNavigate();

  const go = (e) => {
    e.preventDefault();

    if (!nr.trim()) {
      showToast("Uzupełnij numer tablicy", "error");
      return;
    }

    navigate(`/${nr.trim()}`);
  };

  // Funkcja filtrująca spacje na bieżąco
  const handleInputChange = (e) => {
    // Usuwamy spacje z wartości
    const noSpaces = e.target.value.replace(/\s/g, "");
    setNr(noSpaces);
  };

  return (
    <div className="max-w-md mx-auto mt-32 text-center">
      <h1 className="text-3xl font-bold mb-6">
        Wyszukaj tablice rejestracyjną
      </h1>
      <form onSubmit={go} className="flex gap-2">
        <Input
          placeholder="ABC1234"
          value={nr}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Button type="submit">Szukaj</Button>
      </form>
    </div>
  );
}

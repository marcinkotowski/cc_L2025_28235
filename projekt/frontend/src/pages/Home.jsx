import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "../utils/toast";

export default function Home() {
  const [nr, setNr] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    // Usuwamy spacje i zmieniamy na wielkie litery
    const cleaned = e.target.value.replace(/\s/g, "").toUpperCase();
    setNr(cleaned);
  };

  const go = (e) => {
    e.preventDefault();

    const trimmedNr = nr.trim();

    if (!trimmedNr) {
      showToast("Wypełnij wszystkie pola", "error");
      return;
    }

    // Regex: obsługuje zwykłe i indywidualne polskie tablice
    const polishPlateRegex =
      /^([A-Z]{1,3}[0-9]{1,2}[A-Z0-9]{0,4}|[A-Z]{1,2}[0-9][A-Z]{3,5})$/;

    if (!polishPlateRegex.test(trimmedNr)) {
      showToast("Niepoprawny format tablicy rejestracyjnej", "error");
      return;
    }

    navigate(`/${trimmedNr}`);
  };

  return (
    <div className="max-w-md mx-auto mt-32 text-center">
      <h1 className="text-3xl font-bold mb-6">
        Wyszukaj tablicę rejestracyjną
      </h1>
      <form onSubmit={go} className="flex gap-2">
        <Input
          placeholder="KR1234"
          value={nr}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Button type="submit">Szukaj</Button>
      </form>
    </div>
  );
}

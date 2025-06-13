import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default ({ mode }) => {
  // Wczytujemy zmienne środowiskowe z plików .env oraz systemowe dla danego trybu (mode)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    base: "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      // Podajemy zmienną do import.meta.env.VITE_BASEURL jako string
      "import.meta.env.VITE_BASEURL": JSON.stringify(env.VITE_BASEURL),
    },
  });
};

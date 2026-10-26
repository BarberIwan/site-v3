import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // Absolute paden: pagina's staan in submappen (/haircuts/index.html).
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    // gsap levert CommonJS en ESM door elkaar; laat Vite het bundelen.
    noExternal: ['gsap'],
  },
});

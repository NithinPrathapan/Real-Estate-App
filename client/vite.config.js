import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": "https://mern-estate-c7gd.onrender.com",
    },
  },
  plugins: [react()],
});

import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      ink: "#25212b", paper: "#f8f7f4",
      violet: { 50: "#f5f1fb", 100: "#ebe2f7", 200: "#d8c7ed", 300: "#bda1df", 400: "#a17bcf", 500: "#8056b5", 600: "#684294", 700: "#533575", 800: "#402b59", 900: "#302142" }
    },
    fontFamily: { sans: ["DM Sans", "sans-serif"], display: ["Playfair Display", "serif"] },
    boxShadow: { soft: "0 12px 40px rgba(38, 31, 47, 0.08)" }
  }},
  plugins: []
} satisfies Config;
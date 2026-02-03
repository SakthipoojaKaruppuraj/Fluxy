/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // zinc-950
        surface: "#18181b", // zinc-900
        surfaceHighlight: "#27272a", // zinc-800
        primary: "#8b5cf6", // violet-500
        primaryHover: "#7c3aed", // violet-600
        secondary: "#3f3f46", // zinc-700
        border: "#27272a", // zinc-800
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#050511",
          secondary: "#0D0D1F",
          card: "#0F0F2A",
        },
        brand: {
          purple: "#7C3AED",
          blue: "#0EA5E9",
          pink: "#EC4899",
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        neon: {
          purple: "#A855F7",
          blue: "#38BDF8",
          green: "#34D399",
          pink: "#F472B6",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #050511 0%, #0D0D2B 40%, #1a0533 70%, #050511 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(14,165,233,0.05) 100%)",
        "cricket-gradient": "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.05) 100%)",
        "football-gradient": "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.05) 100%)",
        "movies-gradient": "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.05) 100%)",
        "live-gradient": "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.05) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(124,58,237,0.4)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

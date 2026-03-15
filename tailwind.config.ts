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
        saffron: {
          50: "#fff8f0",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#FF6B1A",
          600: "#ea580c",
          700: "#c2410c",
        },
        india: {
          saffron: "#FF6B1A",
          white: "#F8F8F8",
          green: "#138808",
          navy: "#000080",
          chakra: "#0047AB",
        },
        dark: {
          950: "#05070F",
          900: "#080C18",
          800: "#0E1528",
          700: "#141D38",
          600: "#1C2847",
        },
      },
      fontFamily: {
        heading: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-hind)", "sans-serif"],
        display: ["var(--font-bebas)", "sans-serif"],
      },
      backgroundImage: {
        "tricolor": "linear-gradient(180deg, #FF6B1A 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)",
        "saffron-glow": "radial-gradient(ellipse at center, rgba(255,107,26,0.3) 0%, transparent 70%)",
        "hero-gradient": "radial-gradient(ellipse at top, #1C2847 0%, #05070F 60%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,107,26,0.08) 0%, rgba(19,136,8,0.05) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "count-up": "countUp 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "saffron": "0 0 30px rgba(255, 107, 26, 0.3)",
        "green": "0 0 30px rgba(19, 136, 8, 0.2)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "glow": "0 0 60px rgba(255, 107, 26, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;

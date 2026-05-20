import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0A0F",
          elevated: "#12121A",
          panel: "#161620",
          line: "#1F1F2B",
        },
        ink: {
          DEFAULT: "#E8E8EE",
          muted: "#8B8B9E",
          dim: "#5C5C6E",
        },
        accent: {
          anthropic: "#D97706",
          openai: "#059669",
          google: "#2563EB",
          xai: "#7C3AED",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.6875rem",
      },
    },
  },
  plugins: [],
};

export default config;

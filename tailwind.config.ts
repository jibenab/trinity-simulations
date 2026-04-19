import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-alt": "var(--bg-alt)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-mute": "var(--ink-mute)",
        rule: "var(--rule)",
        "rule-soft": "var(--rule-soft)",
        dark: "var(--dark)",
        "dark-ink": "var(--dark-ink)",
        "dark-mute": "var(--dark-mute)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        card: "6px 6px 0 var(--ink)",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
      maxWidth: {
        shell: "1194px",
      },
      letterSpacing: {
        display: "-0.025em",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-text': '#e5e7eb',
        'light-text': '#111827',
        'light-border': '#E5E7EB',
        'dark-border': '#374151',
        'light-input': '#F9FAFB',
        'dark-input': '#1F2937',
      }
    }
  },
  plugins: []
}

export default config
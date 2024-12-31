import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./_layout.{js,jsx,ts,tsx}",
    "./Navigator.{js,jsx,ts,tsx}",
    "./splash.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

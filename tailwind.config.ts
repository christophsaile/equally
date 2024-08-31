import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/preline/preline.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("@tailwindcss/forms")],
};
export default config;

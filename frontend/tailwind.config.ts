import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [daisyui],
  // @ts-ignore – DaisyUI config is not typed in Tailwind's config
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};

export default config;

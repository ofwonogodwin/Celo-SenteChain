/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        celo: {
          green: '#35D07F',
          gold: '#FBCC5C',
          dark: '#2E3338',
        },
      },
    },
  },
  plugins: [],
}

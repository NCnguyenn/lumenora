/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: '#181713',
        background: '#F4F0E8',
        parchment: '#E8E0D2',
        ivory: '#F4F0E8',
        charcoal: '#181713',
        oxblood: '#6B1F2B',
        olive: '#69705A',
        brass: '#8A7452',
        surface: '#F4F0E8',
        muted: '#6B6560',
        border: '#D4CABA',
      },
      letterSpacing: {
        folio: '0.22em',
      },
      maxWidth: {
        editorial: '1440px',
      },
    },
  },
  plugins: [],
}

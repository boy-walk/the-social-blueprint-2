module.exports = {
  content: [
    './**/*.php',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        ibmCondensed: ['"IBM Plex Sans Condensed"', 'sans-serif'],
        ibmHebrew: ['"IBM Plex Sans Hebrew"', 'sans-serif'],
        heebo: ['"Heebo"', 'sans-serif'],
      },
    },
    screens: {
      sm: { max: '767px' },              // 0–767px
      md: { min: '768px', max: '1023px' }, // 768–1023px
      lg: { min: '1024px' },             // ≥1024px
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
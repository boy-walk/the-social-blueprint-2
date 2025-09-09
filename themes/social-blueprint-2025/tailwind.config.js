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
      sm: { max: '567px' },
      md: { min: '568px', max: '1200px' }, // note 1027
      lg: { min: '1201px' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
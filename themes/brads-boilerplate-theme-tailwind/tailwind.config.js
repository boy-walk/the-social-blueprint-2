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
    },
    plugins: [],
  }
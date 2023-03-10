/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'italianno' : 'var(--italianno-font)',
      "robotoFont": "var(--roboto-font)",
      "garamondFont" : "var(--ebGaramond-font)",
      'bodoniModaFont' : "var(--bodoniModa-font)",
      'openSans': 'var(--openSans-font)',
      'lato' : 'var(--lato-font)',
      'montserrat' : 'var(--montserrat-font)',
      'prompt' : 'var(--prompt-font)',
      'slabo' : 'var(--slabo-font)',
      'playfairDisplay' : 'var(--playfairDisplay-font)',
      'cinzel' : 'var(--cinzel-font)',
    },
    extend: {},
  },
  plugins: [],
}

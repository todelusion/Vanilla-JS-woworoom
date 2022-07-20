/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: '#6A33F8'
      },
      fontFamily: {
        sans: ['Noto Sans TC','Roboto'],
        serif: ['Noto Serif TC','Times'],
        dela: ['Dela Gothic One']
      },
    },
  },
  plugins: [],
}

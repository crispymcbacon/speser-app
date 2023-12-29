/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: ["light", "dark", "emerald" , "lemonade"],
    // themes: [
    //   {
    //     mytheme: {
    //       primary: '#0096ca',
    //       secondary: '#00882f',
    //       accent: '#7e4e00',
    //       neutral: '#132f3b',
    //       'base-100': '#feffe4',
    //       info: '#008be4',
    //       success: '#00e16c',
    //       warning: '#ed8000',
    //       error: '#c80542'
    //     }
    //   }
    // ]
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography'),]
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
  './src/**/*.{js,jsx,ts,tsx}',
  './components/**/*.{js,jsx,ts,tsx}',
  './index.html'
],
    theme: {
        extend: {
            colors: {
                'shopee-primary': '#EE4D2D',
                'shopee-hover': '#D73211',
            },
        },
    },
    plugins: [],
}

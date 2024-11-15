/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'inner-custom': 'inset 4px 4px 30px rgba(0, 0, 0, 0.2)',
            },
            colors: {
                primaryColor: '#0070FF',
                secondaryColor: '#3498DB',
                thirdColor: '#587D8B',
            },
            boxShadow: {
                'light': '0 0 10px 2px rgba(100, 100, 100, 0.1)',
                'heavy': '0 0 10px 2px rgba(100, 100, 100, 0.2)',
            }
        },
        screens: {
            'sm': '640px',

            'md': '768px',

            'lg': '1024px',

            'xl': '1280px',

            '2xl': '1536px',
        },
        fontFamily: {
            sans: ['Inter', 'Roboto', 'Open Sans', 'sans-serif'],
        },
    },
    plugins: [],
}
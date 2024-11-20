/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'grid-pattern': `
                    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
            },
            backgroundSize: {
                'grid-pattern': '20px 20px',
            },
            colors: {
                primaryColor: '#0070FF',
                secondaryColor: '#3498DB',
                thirdColor: '#587D8B',
            },
            boxShadow: {
                'light': '0 0 10px 2px rgba(100, 100, 100, 0.1)',
                'heavy': '0 0 10px 2px rgba(100, 100, 100, 0.2)',
            },
            animation: {
                slideIn: 'slideIn 0.5s ease-out',
                slideOut: 'slideOut 0.5s ease-in',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                slideOut: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
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
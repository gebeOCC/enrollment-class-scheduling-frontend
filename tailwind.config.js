/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primaryColor: '#0070FF',
                secondaryColor: '#3498DB',
                thirdColor: '#587D8B',
            },
            boxShadow: {
                'custom-light': '0 0 10px rgba(0, 0, 0, 0.3)',
                'custom-heavy': '0 0 15px rgba(0, 0, 0, 0.3)',
            }
        },
        screens: {
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        }
    },
    plugins: [],
}


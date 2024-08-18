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
    },
    plugins: [],
}


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
            }, colors: {
                primaryColor: '#0070FF',
                secondaryColor: '#3498DB',
                thirdColor: '#587D8B',
                amber: {
                    500: '#ffc000',
                },
                yellow: {
                    500: '#ffff00',
                },
                lightgreen: {
                    500: '#92d050',
                },
                green: {
                    500: '#00b050',
                },
                skyblue: {
                    500: '#00b0f0',
                },
                blue: {
                    500: '#0070c0',
                },
                purple: {
                    500: '#b113bd',
                },
                teal: {
                    500: '#2e9288',
                },
                lightred: {
                    500: '#ff5050',
                },
                coral: {
                    500: '#ff7043',
                },
                darkorange: {
                    500: '#ff8c00',
                },
                deeppink: {
                    500: '#ff1493',
                },
                blueviolet: {
                    500: '#8a2be2',
                },
                cadetblue: {
                    500: '#5f9ea0',
                },
                chartreuse: {
                    500: '#7fff00',
                },
                steelblue: {
                    500: '#4682b4',
                },
                chocolate: {
                    500: '#d2691e',
                },
                turquoise: {
                    500: '#40e0d0',
                },
                mediumvioletred: {
                    500: '#c71585',
                },
                olivedrab: {
                    500: '#6b8e23',
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
/** @type {import('tailwindcss').Config} */

const DARK = "#093565"
const MEDIUM = "#04387C"
const LIGHT = "#0046AD"

export default {
    content: ['./src/**/*.{html,js,svelte,ts}', './server-side/partials/**/*.html'],
    theme: {
        extend: {
            colors: {
                navy: {
                    "900": DARK,
                    "800": MEDIUM,
                    "600": LIGHT,
                }
            },
            keyframes: {
                blink: {
                    '0%, 100%': { backgroundColor: MEDIUM },
                    '50%': { backgroundColor: LIGHT },
                },
            },
            animation: {
                blink: 'blink 1.2s infinite',
            },
        },
    },
    plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['Courier New', 'Courier', 'monospace'],
                sans: ['Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                'brutal-black': '#0a0a0a',
                'brutal-white': '#f5f5f5',
                'brutal-accent': '#ff3e00',
            },
            borderWidth: {
                '3': '3px',
            },
            spacing: {
                '128': '32rem',
            }
        },
    },
    plugins: [],
}
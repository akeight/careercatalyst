import animate from 'tailwindcss-animate';
/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {},
    },
    plugins: [animate],
};

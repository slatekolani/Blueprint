import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                blueprint: {
                    50: '#eff7ff',
                    100: '#dceeff',
                    200: '#b9ddff',
                    300: '#86c5ff',
                    400: '#4ba4ff',
                    500: '#2182f5',
                    600: '#0d64d7',
                    700: '#0b50ae',
                    800: '#0e448f',
                    900: '#103b75',
                    950: '#08264f',
                },
            },
        },
    },

    plugins: [forms],
};

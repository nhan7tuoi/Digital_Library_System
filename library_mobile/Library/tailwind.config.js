/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.tsx', './src/**/*.{tsx,ts}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    dark: '#05CDFA',
                    light: '#05CDFA',
                },
                background: {
                    dark: '#02222E',
                    light: '#FFFFFF',
                },
                text: {
                    dark: '#FFFFFF',
                    light: '#000000',
                },
            },
            height: {
                '9/10': '90%',
                '4/10': '40%',
                '6/10': '60%',
                '2/10': '20%',
                '1/10': '10%',
                '3/10': '30%',
                '7/10': '70%',
                '8/10': '80%',
                '05/10': '5%',
                '1.5/10': '15%',
            },
            width: {
                '4/10': '40%',
                '3/10': '30%',
                '7/10': '70%',
            },
        },
    },
    plugins: [],
};

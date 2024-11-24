/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      iconButtonStyle: {
        border: '1px solid white',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: 'white',
        cursor: 'pointer',
        outline: 'none',
      },

      colors: {
        customPurple: {
          DEFAULT: '#5D3FD3',
          dark: '#4B2BAE',
        },
        customGreen: {
          DEFAULT: '#6bbd00',
          dark: '#5ca000',
        },
      },
      fontSize: {
        xxs: '0.625rem', // 10px
      },
    },
  },
  plugins: [],
};

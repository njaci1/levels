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
      boxShadow: {
        'button-glow': '0 0 8px rgba(255, 255, 255, 0.8)', // White glow
        'button-glow-dark': '0 0 8px rgba(0, 0, 0, 0.8)', // Black glow
        'icon-light': '0 0 4px rgba(200, 200, 200, 0.8)', // Light grey shadow
        'icon-dark': '0 0 4px rgba(50, 50, 50, 0.8)', // Dark shadow for hover effect
      },
      colors: {
        'button-bg': 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
      },
      borderRadius: {
        circle: '50%',
      },
      spacing: {
        'btn-size': '60px', // For button dimensions
        'btn-mobile': '50px', // Smaller button size for mobile
      },
      fontSize: {
        icon: '20px',
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

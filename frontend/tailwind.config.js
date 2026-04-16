/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f3',
        espresso: '#2a2219',
        gold: '#d4a574',
        secondary: '#8c8279',
        'cream-2': '#fdfcf9',
        'cream-3': '#f5f1e8',
        // Luxury Coastal Palette
        'bluebird': '#4D84CF',
        'azurea': '#A0C4FF',
        'miel': '#FFE4A8',
        'butter': '#EEE4BB',
        'royal-green': '#4B6A4A',
        'military-green': '#3B4D3B',
        'sage': '#9DB2A2',
      },
      fontFamily: {
        boska: ['Boska', 'Georgia', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        braven: ['Braven', 'serif'],
        anko: ['Anko', 'serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
      borderRadius: {
        luxury: '2rem',
        'luxury-lg': '2.5rem',
      },
      boxShadow: {
        luxury: '0 25px 50px -12px rgba(42, 34, 25, 0.05)',
        'luxury-md': '0 10px 25px rgba(42, 34, 25, 0.05)',
        'luxury-xl': '0 20px 60px rgba(42, 34, 25, 0.08)',
      },
      backgroundImage: {
        'gradient-section': 'linear-gradient(to bottom, #fdfcf9, #f5f1e8)',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.3em',
        widest4: '0.5em',
      },
    },
  },
  plugins: [],
};

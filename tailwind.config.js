/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        quetico: {
          navy: '#0A1520',
          blue: '#33B1FF',
          cyan: '#33B1FF',
          dark: '#0f2132',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(51, 177, 255, 0.5)',
      }
    },
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(quetico|blue|cyan)/,
      variants: ['hover', 'focus', 'active'],
    },
    {
      pattern: /(bg|text|border)-(.+)/, // This ensures dynamic classes are included
    },
  ]
}

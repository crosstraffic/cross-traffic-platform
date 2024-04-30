const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,mjs,jsx,ts,tsx,svelte}', './public/index.html'],
  safelist: [],
  // whitelistPatterns: [/svelte-/],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Mono', ...defaultTheme.fontFamily.mono],
        code: ['Fira Code']
      }
    },
  },
  daisyui: {
    themes: [
      {
        light: require('daisyui/src/colors/themes')['[data-theme=light]'],
        dark: require('daisyui/src/colors/themes')['[data-theme=dark]']
      }
    ]
  },
  plugins: [require('daisyui')],
};

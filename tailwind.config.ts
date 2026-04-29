import type { Config } from 'tailwindcss';
const tokens = require('./src/app/design-system/tailwind.tokens.js');

const config: Config = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
    },
  },
};

export default config;
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    styled: true,
    themes: ['light', 'dark', 'cupcake', 'retro'],
    base: true,
    utils: true,
    logs: true,  // show in console which theme is applied
    rtl: false,
    prefix: "",
  },
};


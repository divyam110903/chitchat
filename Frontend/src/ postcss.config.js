import tailwindcss from '@tailwindcss/postcss';
import daisyui from 'daisyui';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss(), daisyui(), autoprefixer()],
};
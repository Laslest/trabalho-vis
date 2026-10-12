import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: path.resolve(__dirname, 'public'), // pasta com o csv
});

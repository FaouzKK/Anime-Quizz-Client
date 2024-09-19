import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'apropos.html'),
        profil: resolve(__dirname, 'profile.html'),
        startquizz : resolve(__dirname, 'startquizz.html')
      }
    }
  }
});

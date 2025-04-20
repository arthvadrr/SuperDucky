import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.shared.local') });

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_FRONTEND_PORT) || 5199,
  },
  preview: {
    port: Number(process.env.VITE_FRONTEND_PORT) || 5199,
  },
  build: {
    rollupOptions: {
      /**
       * 🧪
       * Fonts once roamed without a clue,
       * lost in folders, out of view.
       * Now they march to paths assigned,
       * no more chaos, all aligned.
       * 🧪
       */
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name && assetInfo?.name.endsWith('.ttf')) {
            return 'assets/fonts/[name][extname]';
          }

          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
});

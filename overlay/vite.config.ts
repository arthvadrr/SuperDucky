import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.shared.local') });

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_FRONTEND_PORT) || 5199,
  },
});

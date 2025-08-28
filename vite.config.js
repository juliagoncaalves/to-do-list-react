import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/to-do-list-react/', // 👈 coloque o NOME exato do repositório do GitHub aqui
});

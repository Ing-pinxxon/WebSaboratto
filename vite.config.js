import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Reemplaza <!--#include:nombre--> por el contenido de partials/nombre.html
// para compartir nav/pedido/footer/head entre las páginas sin duplicarlos.
function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--#include:([\w-]+)-->/g, (_, name) =>
          readFileSync(resolve(__dirname, `partials/${name}.html`), 'utf-8'));
      },
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hamburguesas: resolve(__dirname, 'hamburguesas/index.html'),
        perros: resolve(__dirname, 'perros-calientes/index.html'),
        salchipapas: resolve(__dirname, 'salchipapas/index.html'),
        sandwiches: resolve(__dirname, 'sandwiches/index.html'),
        bebidas: resolve(__dirname, 'bebidas/index.html'),
      },
    },
  },
});

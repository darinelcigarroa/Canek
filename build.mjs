// build.mjs
import fs from 'fs/promises';
import { PurgeCSS } from 'purgecss';
import path from 'path';

async function purgeAndMinify() {
  // Archivos que PurgeCSS debe analizar para encontrar clases usadas
  const contentFiles = [
    'room-junior.html'
  ];

  // **Sólo** tus CSS (no vendors) para purgar/minificar
  const appCssFiles = [
    'css/style2.css',
    // agrega aquí otros CSS propios si tienes
  ];

  // Vendors que se deben concatenar sin pasar por PurgeCSS
  const vendorCssFiles = [
    'fonts/font-awesome.min.css',
    // agrega aquí otros *.min.css de terceros
  ];

  // Purga únicamente tus CSS
  const purged = await new PurgeCSS().purge({
    content: contentFiles,
    css: appCssFiles,
    // Si alguna vez purgas Font Awesome, recuerda: safelist: ['fa', /^fa-/]
  });

  const purgedCss = purged.map(r => r.css).join('\n');

  // Carga vendors tal cual
  const vendorCss = (await Promise.all(
    vendorCssFiles.map(f => fs.readFile(f, 'utf8'))
  )).join('\n');

  const finalCss = purgedCss + '\n' + vendorCss;

  // Guarda resultado
  await fs.mkdir('dist', { recursive: true });
  await fs.writeFile(path.join('dist', 'app.min.css'), finalCss, 'utf8');

  console.log('CSS generado en dist/app.min.css');
}

async function main() {
  await purgeAndMinify();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

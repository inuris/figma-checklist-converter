import { copyFileSync, mkdirSync, watch as fsWatch, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');

function copyWebStatics() {
  mkdirSync(docs, { recursive: true });
  copyFileSync(join(root, 'web', 'index.html'), join(docs, 'index.html'));
  writeFileSync(join(docs, '.nojekyll'), '');
}

copyWebStatics();
console.log('[watch:all] initial web statics -> docs/');

fsWatch(join(root, 'web', 'index.html'), () => {
  try {
    copyWebStatics();
    console.log('[watch:all] copied web/index.html -> docs/');
  } catch (err) {
    console.error('[watch:all] copy failed', err);
  }
});

const widgetCtx = await esbuild.context({
  entryPoints: [join(root, 'widget-src', 'code.tsx')],
  bundle: true,
  outfile: join(root, 'dist', 'code.js'),
  target: 'es6',
  logLevel: 'info',
});

const webCtx = await esbuild.context({
  entryPoints: [join(root, 'web', 'app.ts')],
  bundle: true,
  outfile: join(docs, 'app.js'),
  target: 'es2016',
  logLevel: 'info',
});

await Promise.all([widgetCtx.watch(), webCtx.watch()]);
console.log('[watch:all] watching widget → dist/code.js, web → docs/app.js (Ctrl+C to stop)');

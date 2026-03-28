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
console.log('[watch:web] initial statics -> docs/');

fsWatch(join(root, 'web', 'index.html'), () => {
  try {
    copyWebStatics();
    console.log('[watch:web] copied web/index.html -> docs/');
  } catch (err) {
    console.error('[watch:web] copy failed', err);
  }
});

const ctx = await esbuild.context({
  entryPoints: [join(root, 'web', 'app.ts')],
  bundle: true,
  outfile: join(docs, 'app.js'),
  target: 'es2016',
  logLevel: 'info',
});

await ctx.watch();
console.log('[watch:web] watching web/app.ts → docs/app.js (Ctrl+C to stop)');

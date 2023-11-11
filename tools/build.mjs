import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

try {
  await esbuild.build({
    bundle: true,
    sourcemap: true,
    platform: 'node',
    loader: {
      '.png': 'dataurl',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    entryPoints: {
      extension: resolve(__dirname, '..', 'src/extension/index.ts'),
      scaffold: resolve(__dirname, '..', 'src/scaffold/index.tsx'),
    },
    outdir: resolve(__dirname, '..', 'dist'),
    external: ['vscode'],
  });

  console.log('[build] build successful');
} catch (ex) {
  console.error(ex);
  console.log('[build] build failed');
  process.exit(1);
}

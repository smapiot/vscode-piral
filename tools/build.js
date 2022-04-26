const { resolve } = require('path');
const esbuild = require('esbuild');

esbuild
  .build({
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
  })
  .then(
    () => {
      console.log('[build] build finished');
    },
    () => {
      console.log('[build] build failed');
      process.exit(1);
    },
  );

const { resolve } = require('path');
const esbuild = require('esbuild');

esbuild
  .build({
    bundle: true,
    watch: {
      onRebuild(err) {
        if (err) {
          err.errors.forEach((err) => console.error(err.text));
        }

        console.log('[watch] rebuild done');
      },
    },
    loader: {
      '.png': 'dataurl',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    sourcemap: true,
    platform: 'node',
    entryPoints: {
      extension: resolve(__dirname, '..', 'src/extension/index.ts'),
      scaffold: resolve(__dirname, '..', 'src/scaffold/index.tsx'),
    },
    outdir: resolve(__dirname, '..', 'dist'),
    external: ['vscode'],
  })
  .then(
    () => {
      console.log('[watch] build finished');
    },
    () => {
      console.log('[watch] build failed');
      process.exit(1);
    },
  );

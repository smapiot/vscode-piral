import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

try {
  const ctx = await esbuild
    .context({
      bundle: true,
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
      plugins: [
        {
          name: 'watch-notifications',
          setup(build) {
            build.onEnd(result => {
              if (result.errors.length > 0) {
                console.error('[watch] rebuild failed');
              } else {
                console.log('[watch] rebuild successful');
              }
            });
          },
        }
      ],
      outdir: resolve(__dirname, '..', 'dist'),
      external: ['vscode'],
    });


    await ctx.watch();
    console.log('[watch] build finished');
} catch (ex) {
  console.error(ex);
  console.log('[watch] build failed');
  process.exit(1);
}

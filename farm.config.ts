import { URL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { defineConfig, loadEnv } from '@farmfe/core';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as Env.ImportMeta;

  const buildTime = getBuildTime();

  // @todo: 等farm/cli下个版本支持，先写死
  // const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;
  const enableProxy = true;

  return {
    compilation: {
      define: {
        BUILD_TIME: JSON.stringify(buildTime)
      },
      output: {
        publicPath: viteEnv.VITE_BASE_URL
      },
      resolve: {
        alias: {
          '~': fileURLToPath(new URL('./', import.meta.url)),
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
      // preview: {
      //   port: 9725
      // },
      // build: {
      //   reportCompressedSize: false,
      //   sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      //   commonjsOptions: {
      //     ignoreTryCatch: false
      //   }
      // }
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      proxy: createViteProxy(viteEnv, enableProxy)
    },
    plugins: [
      [
        '@farmfe/plugin-sass',
        {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      ]
    ],
    vitePlugins: setupVitePlugins(viteEnv, buildTime) as object[]
  };
});

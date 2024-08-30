import path from 'node:path';
import process from 'node:process';
import { defineConfig } from '@unocss/vite';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import presetUno from '@unocss/preset-uno';
import type { Theme } from '@unocss/preset-uno';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import presetIcons from '@unocss/preset-icons';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { themeVars } from './src/theme/vars';

// 先写死
const VITE_ICON_PREFIX = 'icon';
const VITE_ICON_LOCAL_PREFIX = 'icon-local';
const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');
const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem'
    }
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm'
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno({ dark: 'class' }),
    presetSoybeanAdmin(),
    presetIcons({
      prefix: `${VITE_ICON_PREFIX}-`,
      scale: 1,
      extraProperties: {
        display: 'inline-block'
      },
      collections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      warn: true
    })
  ]
});

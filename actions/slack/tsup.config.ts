import { Options, defineConfig as defineConfigTSUP } from 'tsup';

const options: Options = {
  name: 'main',
  config: 'tsconfig.json',
  entry: ['./index.ts'],
  outDir: './dist',
  platform: 'node',
  format: ['cjs'],
  legacyOutput: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  splitting: false,
  dts: true,
  treeshake: {
    preset: 'recommended',
  },
};

export default defineConfigTSUP(options);

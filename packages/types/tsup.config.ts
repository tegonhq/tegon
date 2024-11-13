import { Options, defineConfig as defineConfigTSUP } from 'tsup';

const options: Options = {
  name: 'main',
  config: 'tsconfig.json',
  entry: ['./src/index.ts'],
  external: ['class-validator', 'class-transformer'], // Optional: externalize these libraries
  outDir: './dist',
  platform: 'node',
  format: ['cjs', 'esm'],
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

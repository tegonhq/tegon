/** Copyright (c) 2022, Poozle, all rights reserved. **/

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const backendPlugins = [
  nodePolyfills(),
  json(),
  resolve({ extensions: ['.js', '.ts'] }),
  commonjs({
    include: /\/node_modules\//,
  }),
  typescript(),
  terser(),
];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input: './index.ts',
    external: ['axios', '@tegonhq/sdk'],
    output: [
      {
        file: 'dist/index.js',
        sourcemap: true,
        format: 'cjs',
        exports: 'named',
        preserveModules: false,
        inlineDynamicImports: true,
      },
    ],
    plugins: backendPlugins,
  },
];

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

/** @type {import('rollup').RollupOptions[]} */
const config = [{
  input: 'au.build.js',
  output: {
    file: 'dist/vendors/au.js',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    commonjs({ extensions: ['.js', /* '.ts' */] }),
    terser()
  ]
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  external: /@aurelia/,
  plugins: [
    typescript(),
  ]
}]

export default config;

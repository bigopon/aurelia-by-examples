import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

/**
 * @param {boolean} [dev]
 */
const aliases = (dev) => [
  'kernel',
  'metadata',
  'platform',
  'platform-browser',
  'runtime-html',
  'expression-parser',
  'template-compiler',
  'runtime',
  'kernel',
  'runtime-html',
].reduce((acc) => {
  if (dev) {
    acc[`@aurelia/${acc}`] = acc[`@aurelia/${acc}/development`];
  }
  return acc;
}, {});

export default defineConfig([{
  input: 'au.build.js',
  output: [{
    file: 'dist/vendors/au.dev.js',
    format: 'es',
  }],
  plugins: [
    alias({
      entries: aliases(true)
    }),
    nodeResolve({
      modulesOnly: true,
      browser: true,
      dedupe: importee => /@?aurelia/.test(importee),
    }),
    // commonjs({ extensions: ['.js', /* '.ts' */] }),
    terser()
  ]
}, {
  input: 'au.build.js',
  output: [{
    file: 'dist/vendors/au.js',
    format: 'es',
    plugins: [
      terser()
    ]
  }],
  plugins: [
    nodeResolve({
      modulesOnly: true,
      browser: true,
      dedupe: importee => /@?aurelia/.test(importee),
    }),
    // commonjs({ extensions: ['.js', /* '.ts' */] }),
    // terser()
  ]
}, {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  }],
  external: /@aurelia/,
  plugins: [
    typescript({
      sourceMap: true,
    }),
  ]
}]);

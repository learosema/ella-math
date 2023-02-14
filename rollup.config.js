import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    plugins: [typescript()],
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'es',
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'Ella',
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [typescript({ target: 'es5' })],
    output: [
      {
        file: 'dist/index.umd.es5.js',
        format: 'umd',
        name: 'Ella',
      },
    ],
  },
];

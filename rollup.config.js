import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/ella.ts',
  output: [{
    file: 'dist/ella.esm.js',
    format: 'es'
  }, {
    file: 'dist/ella.umd.js',
    format: 'umd',
    name: 'GLea'
  }],
  plugins: [
    typescript()
  ]
};

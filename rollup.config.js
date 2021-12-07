import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/main.js', format: 'esm'
  },
  plugins: [ts(), resolve()]
}
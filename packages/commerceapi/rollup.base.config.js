import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export function generateBaseConfig(pkg) {
  return {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main
      },
      {
        file: pkg.module
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
      typescript({
        // eslint-disable-next-line global-require
        typescript: require('typescript')
      }),
      terser()
    ]
  };
}

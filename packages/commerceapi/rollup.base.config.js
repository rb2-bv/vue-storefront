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
        tsconfigOverride: {
          compilerOptions: {
              sourceMap: true,
              inlineSourceMap: true,
              module: "ES2015"
          }
        },        
        // eslint-disable-next-line global-require
        typescript: require('typescript')
      }),
      terser()
    ]
  };
}

import { defineConfig } from 'tsup';

export const tsupConfigBase = defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
});

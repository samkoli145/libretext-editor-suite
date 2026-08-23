import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@libretext/core': path.resolve(__dirname, 'packages/core/src'),
      '@libretext/core/*': path.resolve(__dirname, 'packages/core/src/*'),
      '@libretext/algorithms': path.resolve(__dirname, 'packages/algorithms/src'),
      '@libretext/algorithms/*': path.resolve(__dirname, 'packages/algorithms/src/*'),
      '@libretext/storage': path.resolve(__dirname, 'packages/storage/src'),
      '@libretext/storage/*': path.resolve(__dirname, 'packages/storage/src/*'),
      '@libretext/templates': path.resolve(__dirname, 'packages/templates/src'),
      '@libretext/templates/*': path.resolve(__dirname, 'packages/templates/src/*'),
    },
  },
  test: {
    globals: true,
    include: ['packages/*/tests/**/*.test.ts'],
    projects: [
      {
        resolve: {
          alias: {
            '@libretext/core': path.resolve(__dirname, 'packages/core/src'),
            '@libretext/core/*': path.resolve(__dirname, 'packages/core/src/*'),
            '@libretext/algorithms': path.resolve(__dirname, 'packages/algorithms/src'),
            '@libretext/algorithms/*': path.resolve(__dirname, 'packages/algorithms/src/*'),
            '@libretext/storage': path.resolve(__dirname, 'packages/storage/src'),
            '@libretext/storage/*': path.resolve(__dirname, 'packages/storage/src/*'),
            '@libretext/templates': path.resolve(__dirname, 'packages/templates/src'),
            '@libretext/templates/*': path.resolve(__dirname, 'packages/templates/src/*'),
          },
        },
        test: {
          name: 'node',
          globals: true,
          environment: 'node',
          include: [
            'packages/{core,algorithms,storage,templates,serializers,plugins,shared,shell}/tests/**/*.test.ts',
          ],
        },
      },
      {
        resolve: {
          alias: {
            '@libretext/core': path.resolve(__dirname, 'packages/core/src'),
            '@libretext/core/*': path.resolve(__dirname, 'packages/core/src/*'),
            '@libretext/algorithms': path.resolve(__dirname, 'packages/algorithms/src'),
            '@libretext/algorithms/*': path.resolve(__dirname, 'packages/algorithms/src/*'),
            '@libretext/storage': path.resolve(__dirname, 'packages/storage/src'),
            '@libretext/storage/*': path.resolve(__dirname, 'packages/storage/src/*'),
            '@libretext/templates': path.resolve(__dirname, 'packages/templates/src'),
            '@libretext/templates/*': path.resolve(__dirname, 'packages/templates/src/*'),
          },
        },
        test: {
          name: 'jsdom',
          globals: true,
          environment: 'jsdom',
          include: ['packages/adapters/tests/**/*.test.ts'],
        },
      },
    ],
  },
});

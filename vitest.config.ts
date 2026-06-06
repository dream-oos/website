import { getViteConfig } from 'astro/config';
import type {} from 'vitest/config';

export default getViteConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});

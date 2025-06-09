import { defineConfig } from 'astro/config';
import astroTwig from '../src/index.js';

export default defineConfig({
  integrations: [astroTwig({ componentRoots: ['./components'] })],
});

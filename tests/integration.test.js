import { describe, it, expect } from 'vitest';
import path from 'path';
import astroTwig from '../src/index.js';

const siteRoot = path.join(process.cwd(), 'example');

describe('astro-twig integration', () => {
  it('renders card component', async () => {
    const plugin = astroTwig({ componentRoots: [path.join(siteRoot, 'components')] });
    const html = await plugin.render({ filename: 'card.twig', data: { title: 'Test' } });
    expect(html.trim()).toBe('<div class="card">Test</div>');
  });
});

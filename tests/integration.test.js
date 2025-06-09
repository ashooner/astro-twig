import { describe, it, expect } from 'vitest';
import path from 'path';
import astroTwig from '../src/index.js';

const siteRoot = path.join(process.cwd(), 'example');

describe('astro-twig integration', () => {
  it('renders card component', async () => {
    const plugin = astroTwig({ componentRoots: [path.join(siteRoot, 'components')] });
    const result = await plugin.render({ filename: 'card/card.twig', props: { title: 'Test', body: 'Body' }, slots: { header: 'Head', footer: 'Foot' } });
    expect(result.html.trim()).toBe('<div class="card">\n  <header>Head</header>\n  <h2>Test</h2>\n  <p>Body</p>\n  <footer>Foot</footer>\n</div>');
    expect(result.css.length).toBe(1);
    expect(result.js.length).toBe(1);
  });

  it('allows nested component in slot', async () => {
    const plugin = astroTwig({ componentRoots: [path.join(siteRoot, 'components')] });
    const button = await plugin.render({ filename: 'button/button.twig', props: { label: 'Click', url: '#' } });
    const card = await plugin.render({
      filename: 'card/card.twig',
      props: { title: 'Nested', body: 'Body' },
      slots: { header: button.html, footer: 'End' }
    });
    expect(card.html).toContain('<a class="button" href="#">Click</a>');
  });
});

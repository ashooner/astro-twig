import Twig from 'twig';
import DrupalTwigLoader from './loader.js';

export default function astroTwig(options = {}) {
  const {
    componentRoots = [],
    lookupPaths = [],
    precompile = false,
  } = options;

  const loader = new DrupalTwigLoader({ componentRoots, lookupPaths });
  return {
    name: 'astro-twig',
    hooks: {
      'astro:config:setup': async ({ updateConfig }) => {
        updateConfig({ vite: { plugins: [] } });
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          next();
        });
      },
    },
    async render({ filename, data }) {
      const tpl = await loader.load(filename);
      const compiled = Twig.twig({ data: tpl, path: filename });
      return compiled.render(data);
    },
  };
}

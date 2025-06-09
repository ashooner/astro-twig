import Twig from 'twig';
import DrupalTwigLoader from './loader.js';

export default function astroTwig(options = {}) {
  const {
    componentRoots = [],
    lookupPaths = [],
    precompile = false,
  } = options;

  const loader = new DrupalTwigLoader({ componentRoots, lookupPaths });

  Twig.Templates.registerLoader('drupal', async function (location, params, callback, errorCallback) {
    try {
      const data = await loader.load(location, params.path);
      params.data = data;
      params.path = location;
      const parser = this.parsers[params.parser] || this.parser.twig;
      const template = parser.call(this, params);
      if (typeof callback === 'function') callback(template);
      return template;
    } catch (err) {
      if (typeof errorCallback === 'function') errorCallback(err);
      throw err;
    }
  });
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
      const compiled = Twig.twig({ data: tpl, path: filename, method: 'drupal' });
      return compiled.render(data);
    },
  };
}

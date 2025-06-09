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
    async render({ filename, props = {}, slots = {} }) {
      const { template, spec, css, js } = await loader.load(filename);
      loader.validate(spec, { props, slots });
      const defaults = {};
      for (const [key, info] of Object.entries(spec.props || {})) {
        if (info.default !== undefined) defaults[key] = info.default;
      }
      const compiled = Twig.twig({ data: template, path: filename });
      const html = compiled.render({ ...defaults, ...props, slots });
      return { html, css, js };
    },
  };
}

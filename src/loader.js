import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export default class DrupalTwigLoader {
  constructor(options = {}) {
    this.componentRoots = options.componentRoots || [];
    this.extraLookup = options.lookupPaths || [];
  }

  resolve(from, to) {
    if (path.isAbsolute(to)) return to;
    if (from) {
      const dir = path.dirname(from);
      return path.join(dir, to);
    }
    return to;
  }

  async load(location, from = null) {
    const target = this.resolve(from, location);
    for (const base of [...this.componentRoots, ...this.extraLookup]) {
      const file = path.join(base, target);
      try {
        const template = await fs.readFile(file, 'utf8');
        const dir = path.dirname(file);
        const specPath = path.join(dir, 'component.yml');
        let spec = {};
        try {
          const raw = await fs.readFile(specPath, 'utf8');
          spec = yaml.load(raw) || {};
        } catch (e) {}

        const css = [];
        for (const cssFile of spec.libraries?.css || []) {
          try {
            css.push(await fs.readFile(path.join(dir, cssFile), 'utf8'));
          } catch (e) {}
        }

        const js = [];
        for (const jsFile of spec.libraries?.js || []) {
          try {
            js.push(await fs.readFile(path.join(dir, jsFile), 'utf8'));
          } catch (e) {}
        }

        return { template, spec, css, js };
      } catch (e) {}
    }
    throw new Error(`Template not found: ${target}`);
  }

  validate(spec, { props = {}, slots = {} }) {
    const allowedProps = Object.keys(spec.props || {});
    const allowedSlots = Object.keys(spec.slots || {});
    for (const key of Object.keys(props)) {
      if (!allowedProps.includes(key)) {
        throw new Error(`Unknown prop: ${key}`);
      }
    }
    for (const key of Object.keys(slots)) {
      if (!allowedSlots.includes(key)) {
        throw new Error(`Unknown slot: ${key}`);
      }
    }
  }
}

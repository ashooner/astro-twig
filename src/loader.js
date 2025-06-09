import { promises as fs } from 'fs';
import path from 'path';

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
        return await fs.readFile(file, 'utf8');
      } catch (e) {}
    }
    throw new Error(`Template not found: ${target}`);
  }
}

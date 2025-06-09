## Overview
A proposed Astro plugin will allow Drupal Single Directory Components (SDCs) written in Twig to be consumed directly by an Astro site. The plugin should make Twig components available just like any other component type so they can be imported into `.astro` or `.js` files. Depending on how easily the templates can be precompiled, the plugin may either compile templates at build time or render them at runtime. It also needs to replicate Drupal's custom Twig loader behaviour so that includes and extends resolve correctly.

## Steps
1. **Research existing tooling**
   - Review Drupal's SDC format and how it organizes Twig files, YAML metadata, CSS, and JS.
   - Evaluate Node packages for compiling or rendering Twig (e.g. `twig` or `drupal-twig`) and identify how to hook custom loaders.
2. **Create an Astro integration skeleton**
   - Scaffold a new package with `astro add` conventions, exposing a default function that registers hooks.
   - Provide options to configure component directories and whether to precompile at build or runtime.
3. **Implement a Twig loader**
   - Reproduce Drupal's loader logic so templates can `include` or `extend` other SDC files using component-relative paths.
   - Offer a way to register additional lookup paths (modules, themes, etc.).
4. **Build‑time compilation**
   - In the integration's `build:setup` and `build:ssr` hooks, compile Twig to HTML when component props are known at build time.
   - Cache compiled templates to speed up repeated builds.
5. **Runtime rendering fallback**
   - When props are only available at runtime, emit a small wrapper component that loads and renders the Twig template with the loader.
   - Ensure that hydration and Astro island behaviour are preserved.
6. **Importing Twig components**
   - Allow syntax such as `import Card from "./components/card/card.twig";` in `.astro` or `.js` files.
   - Expose props to the Twig template just like other Astro components.
7. **Testing and examples**
   - Provide example SDCs and usage snippets within the repo.
   - Add tests covering build and runtime scenarios to ensure loader paths resolve correctly.
8. **Documentation**
   - Document installation, configuration options, and any limitations.
9. **Nested SDC invocation**
   - Allow one SDC to call another directly, enabling components to be rendered
     from within Twig templates rather than solely through slot content.

## Progress
### Step 1: Research existing tooling
- Explored the `twig` npm package for template rendering.
- Identified `drupal-twig-extensions` to replicate Drupal specific filters.

### Step 2: Create an Astro integration skeleton
- Added an `astro-twig` package with ESM `package.json`.
- Implemented an integration that registers Astro hooks and exposes a `render` method.

### Step 3: Implement a Twig loader
- Created `DrupalTwigLoader` to resolve templates relative to component roots and lookup paths.
- Registered a custom `drupal` loader with Twig so includes and extends work like in Drupal.

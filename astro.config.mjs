import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cherub-atelier.netlify.app',

  integrations: [sitemap()],

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // Allow Sanity's CDN domain for the <Image> component
  image: {
    domains: ['cdn.sanity.io'],
  },

  // Phase 6: never inline compiled CSS as <style> elements. Astro's default
  // ('auto') inlines any stylesheet under 4KB directly into the HTML, which
  // a strict CSP (style-src 'self', no 'unsafe-inline'/hash/nonce) blocks
  // outright — that's what broke the site's formatting after the Phase 6
  // netlify.toml went live. Forcing 'never' keeps every stylesheet as a
  // same-origin <link rel="stylesheet">, which 'self' already allows, so
  // the CSP itself doesn't need to weaken.
  build: {
    inlineStylesheets: 'never',
  },

  // Phase 7 fix: same class of bug as the inlineStylesheets setting above,
  // but for JS. Astro inlines a page's <script> as a literal <script
  // type="module"> block (no src) when the compiled chunk is standalone and
  // under Vite's assetsInlineLimit (default 4096 bytes) — verified by
  // reading node_modules/astro/dist/core/build/plugins/plugin-scripts.js.
  // Both the gallery filter script and the artwork-photo thumbnail script
  // are well under that limit, so they were being inlined and silently
  // dropped by the CSP's script-src 'self' (no 'unsafe-inline') — the
  // scripts never even threw a visible console error, they just never ran.
  // assetsInlineLimit: 0 forces every script (and other asset) to its own
  // same-origin file instead, which 'self' already allows.
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },

  output: 'static',
});

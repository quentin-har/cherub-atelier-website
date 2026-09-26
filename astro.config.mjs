import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Phase 8-I fix: this was still the pre-custom-domain Netlify subdomain,
  // so every URL in the generated sitemap (and any future canonical tag)
  // pointed at cherub-atelier.netlify.app instead of the real domain --
  // exactly the kind of thing that confuses Google about which URL is
  // canonical. Now matches the actual primary domain set in Phase 8-B.
  site: 'https://cherub-atelier.fr',

  integrations: [
    sitemap({
      // Exclude the contact form's thank-you pages: a visitor only lands
      // here mid-flow, they add no search value, and indexing them risks
      // a stray "Merci !" / "Thank you" page showing up in results for a
      // query it was never meant to answer. Resolves the open, non-blocking
      // item noted in LAUNCH_CHECKLIST.md's Phase 8-I.
      filter: (page) => !page.includes('/merci'),
    }),
  ],

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

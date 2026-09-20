// Sanity client — reads all configuration from Netlify environment variables.
// The GitHub repo is public, so credentials must NEVER be hard-coded here.
// Phase 4: add SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN to
//          Netlify → Site settings → Environment variables.

import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset   = import.meta.env.SANITY_DATASET ?? 'production';
const apiToken  = import.meta.env.SANITY_API_TOKEN;

if (!projectId) {
  // Expected during Phase 2/3 before Sanity is configured.
  // Once Phase 4 is done this warning disappears.
  console.warn(
    '[Sanity] SANITY_PROJECT_ID not set — gallery will be empty until Phase 4.'
  );
}

export const sanityClient = createClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion: '2024-01-01', // Pinned — safe to advance after Phase 4
  // Phase 7 fix: useCdn was true, reading from Sanity's cached API CDN.
  // That CDN is meant for high-traffic browser reads, not one-shot static
  // builds — Sanity's own docs say so explicitly ("For static builds, the
  // live uncached API is a better fit to ensure you get the latest
  // content"). With useCdn:true, a build triggered right after mum or
  // Quentin publishes an edit could still read the CDN's not-yet-invalidated
  // cached response and bake stale content into the static site — which is
  // what happened to an artwork's photos here. false always hits the direct
  // API, so every build reflects exactly what's published in Sanity.
  useCdn: false,
  token: apiToken,          // Read-only token; never use a write token here
});

// GROQ queries — Sanity's query language (think: SQL for document stores).
// These are used at build time: Astro fetches content from Sanity and
// bakes it into static HTML. No database queries happen at runtime.

// All published artworks, newest first
export const allArtworksQuery = `
  *[_type == "artwork"] | order(_createdAt desc) {
    _id,
    title_fr,
    title_en,
    "slug": slug.current,
    "slug_en": slug_en.current,
    category,
    description_fr,
    description_en,
    "images": images[].asset->url,
    "imageUrl": images[0].asset->url,
    status,
    price_indication,
    date_created,
    featured_home
  }
`;

// Artworks filtered to a single category.
// Uses a GROQ parameter ($category) instead of string interpolation so a
// category value can never break out of the query string (no injection
// surface), regardless of where the value ends up coming from later
// (a filter UI, a URL param, etc.).
export const artworksByCategoryQuery = `
  *[_type == "artwork" && category == $category] | order(_createdAt desc) {
    _id,
    title_fr,
    title_en,
    "slug": slug.current,
    "slug_en": slug_en.current,
    category,
    description_fr,
    description_en,
    "images": images[].asset->url,
    "imageUrl": images[0].asset->url,
    status,
    price_indication,
    date_created,
    featured_home
  }
`;

// Call it like:
//   sanityClient.fetch(artworksByCategoryQuery, { category: 'pottery' })

// A single artwork by slug — used to build the detail page route.
// Matches either the French or English slug (a French page might be
// reached via an English-slugged link, or vice versa) and falls back to
// matching on _id so an artwork published before the slug field existed
// still gets a working (if less pretty) detail page.
export const artworkBySlugOrIdQuery = `
  *[_type == "artwork" && (slug.current == $slug || slug_en.current == $slug || _id == $slug)][0] {
    _id,
    title_fr,
    title_en,
    "slug": slug.current,
    "slug_en": slug_en.current,
    category,
    description_fr,
    description_en,
    "images": images[].asset->url,
    "imageUrl": images[0].asset->url,
    status,
    price_indication,
    date_created,
    featured_home
  }
`;

// The singleton À propos document (fixed document ID, see
// studio/sanity.config.ts). Direct id lookup, not a type filter.
export const aboutPageQuery = `
  *[_id == "aboutPage"][0] {
    bio_fr,
    bio_en,
    "photoUrl": photo.asset->url
  }
`;

// The singleton legal-notice document (fixed document ID 'legalNotice',
// see studio/schemaTypes/legalNotice.ts). Holds only the publication
// director's name -- the one piece of the mentions légales that's
// personal information and therefore kept out of this repo's git history,
// fetched from Sanity at build time instead of hardcoded in the page.
export const legalNoticeQuery = `
  *[_id == "legalNotice"][0] {
    directorName
  }
`;

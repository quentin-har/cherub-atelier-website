// Shared helper for the header's language toggle and the <head> hreflang
// tags in BaseLayout.astro. Both need the same thing: given the current
// page's path and language, what is the equivalent URL in the other
// language?
//
// Most pages have a fixed 1:1 path pair between French and English (only
// the "galerie"/"a-propos" segments actually change name; contact, merci,
// and mentions-legales are spelled the same in both languages), so this
// can be computed generically from the URL alone.
//
// The one exception is an artwork detail page: the slug itself differs per
// language (`slug` vs `slug_en` in Sanity), which this function has no way
// to know. Those pages compute their own target URL from the artwork data
// they already fetched and pass it into <BaseLayout altHref={...}> instead
// of relying on this function.

// Path segments that change name between languages. Order/direction
// doesn't matter -- getAltHref swaps whichever side matches.
const SEGMENT_PAIRS: [string, string][] = [
  ['galerie', 'gallery'],
  ['a-propos', 'about'],
];

export function getAltHref(pathname: string, lang: string): string {
  const otherLang = lang === 'fr' ? 'en' : 'fr';
  const segments = pathname.split('/').filter(Boolean); // "/fr/galerie" -> ['fr', 'galerie']

  if (segments.length === 0) {
    // Shouldn't happen (every real page is under /fr/ or /en/), but fall
    // back to that language's homepage rather than an empty href.
    return `/${otherLang}/`;
  }

  segments[0] = otherLang;

  if (segments[1]) {
    const pair = SEGMENT_PAIRS.find((p) => p.includes(segments[1]));
    if (pair) {
      segments[1] = pair[0] === segments[1] ? pair[1] : pair[0];
    }
  }

  return segments.length > 1 ? `/${segments.join('/')}` : `/${segments.join('/')}/`;
}

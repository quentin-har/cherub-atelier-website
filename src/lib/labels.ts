// Shared label maps for artwork categories and statuses.
//
// Previously hand-duplicated in four places (ArtworkCard.astro,
// fr/galerie/[slug].astro, en/gallery/[slug].astro, plus the Sanity
// schema's own dropdown options in studio/schemaTypes/artwork.ts, which
// lives in a separate package and can't share this file). Centralizing
// the website-side copies here means renaming a category or status label
// is a one-line change instead of a hunt across three files.

export type Category = 'pottery' | 'stained-glass' | 'wire-sculpture';
export type Status = 'available' | 'display_only' | 'sold';
export type Lang = 'fr' | 'en';

export const categoryLabels: Record<Lang, Record<Category, string>> = {
  fr: {
    pottery: 'Céramique',
    'stained-glass': 'Vitrail',
    'wire-sculpture': 'Fil de Fer',
  },
  en: {
    pottery: 'Pottery',
    'stained-glass': 'Stained Glass',
    'wire-sculpture': 'Wire Sculpture',
  },
};

// No label for the normal "available" case in either language -- only the
// two statuses that change what a visitor should expect (can't buy it /
// already gone) ever need a badge.
export const statusLabels: Record<Lang, Partial<Record<Status, string>>> = {
  fr: {
    display_only: 'Exposition uniquement',
    sold: 'Déjà vendue',
  },
  en: {
    display_only: 'Display only',
    sold: 'Already sold',
  },
};

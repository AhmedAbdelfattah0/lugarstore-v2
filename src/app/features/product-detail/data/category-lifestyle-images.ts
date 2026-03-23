/**
 * Curated lifestyle + craft images per category ID.
 *
 * lifestyle — full-bleed editorial image for the scrollytelling lifestyle section
 * craft     — image for the craft/heritage two-column section
 *
 * Add high-quality room/lifestyle images to /public/ and map them here.
 * When a category has no entry (or a null value), the component falls back
 * to the product's own uploaded images.
 *
 * Categories (from API):
 *   1  — Chairs
 *   2  — Bedrooms
 *   6  — Living Room
 *   8  — Dining Room
 *   24 — Sofa
 *   33 — Sideboard & Buffets
 *   34 — Side tables set
 *   35 — Home accessories
 *   36 — Living room table
 */
export interface CategoryLifestyleImages {
  lifestyle: string;
  craft: string;
}

export const CATEGORY_LIFESTYLE_IMAGES: Record<number, CategoryLifestyleImages> = {
  // Sofa — room-3 (living room scene with sofa) + room-4 (detail/side angle)
  24: { lifestyle: 'room-3.jpg', craft: 'room-4.jpg' },

  // Living Room
  6: { lifestyle: 'room-2.jpg', craft: 'room-3.jpg' },

  // Living room table
  36: { lifestyle: 'room-2.jpg', craft: 'room-3.jpg' },

  // Chairs
  1: { lifestyle: 'room-4.jpg', craft: 'room-5.jpg' },

  // Bedrooms
  2: { lifestyle: 'room-5.jpg', craft: 'room-6.jpg' },

  // Dining Room
  8: { lifestyle: 'room-6.jpg', craft: 'room-2.jpg' },

  // Sideboard & Buffets
  33: { lifestyle: 'room-1.png', craft: 'room-2.jpg' },

  // Side tables set
  34: { lifestyle: 'room-4.jpg', craft: 'room-3.jpg' },

  // Home accessories
  35: { lifestyle: 'room-5.jpg', craft: 'room-4.jpg' },
};

/** Default when no category-specific entry exists */
export const DEFAULT_LIFESTYLE_IMAGES: CategoryLifestyleImages = {
  lifestyle: 'hero-lifestyle.jpg',
  craft:     'hero-lifestyle.jpg',
};

export function getLifestyleImages(categoryId: number): CategoryLifestyleImages {
  return CATEGORY_LIFESTYLE_IMAGES[categoryId] ?? DEFAULT_LIFESTYLE_IMAGES;
}

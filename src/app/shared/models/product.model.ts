// Raw API shape — only used inside ProductService, never exposed to components
interface RawProduct {
  id: number;
  title: string;
  titleAr: string;
  discountedPrice: string;   // string "0" means no discount
  originalPrice: string;     // string — must be parsed
  description: string;
  imgOne: string;
  imgTwo: string;
  imgThree: string;
  imgFour: string;
  videoLink: string;
  categoryId: string;        // string — must be parsed to number
  subCategoryId: number;     // 1 = New, 5 = Top
  rating: number;
  isNew?: boolean;
  discount: number;
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string;
  qty: number;
  categoryName: string;
}

// Unified model — what ALL components receive
export interface Product {
  id: number;
  title: string;
  titleAr: string;
  price: number;              // parsed from originalPrice
  discountedPrice: number;    // parsed from discountedPrice, 0 = no discount
  discount: number;           // percentage e.g. 20
  hasDiscount: boolean;       // computed: discountedPrice > 0
  images: string[];           // normalized from imgOne/imgTwo/imgThree/imgFour
  primaryImage: string;       // images[0] with fallback
  categoryId: number;         // parsed from string
  categoryName: string;
  subCategoryId: number;
  isNew: boolean;             // subCategoryId === 1
  isTop: boolean;             // subCategoryId === 5
  isOutOfStock: boolean;      // availability !== 'in_stock'
  rating: number;
  reviews: number;
  description: string;
  videoLink?: string;
  badge?: string;
  subtitle?: string;
  qty: number;
}

// Normalization function — used inside ProductService only
export function normalizeProduct(raw: RawProduct): Product {
  const images = [raw.imgOne, raw.imgTwo, raw.imgThree, raw.imgFour]
    .filter(Boolean);
  return {
    id: raw.id,
    title: raw.title,
    titleAr: raw.titleAr,
    price: Number(raw.originalPrice),
    discountedPrice: Number(raw.discountedPrice),
    discount: raw.discount,
    hasDiscount: Number(raw.discountedPrice) > 0,
    images,
    primaryImage: images[0] || 'assets/images/placeholder.png',
    categoryId: Number(raw.categoryId),
    categoryName: raw.categoryName,
    subCategoryId: raw.subCategoryId,
    isNew: raw.subCategoryId === 1,
    isTop: raw.subCategoryId === 5,
    isOutOfStock: raw.availability !== 'in_stock',
    rating: raw.rating,
    reviews: raw.reviews ?? 0,
    description: raw.description,
    videoLink: raw.videoLink,
    badge: raw.badge,
    subtitle: raw.subtitle,
    qty: raw.qty,
  };
}

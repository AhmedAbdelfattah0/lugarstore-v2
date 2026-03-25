export interface CartItem {
  id: number;
  title: string;
  image: string;
  qty: number;
  price: number;
  categoryName?: string;
}

// localStorage keys
export const STORAGE_KEYS = {
  CART: 'shoppingCart',
  WISHLIST: 'wishlist',
  CUSTOM_ORDER: 'currentCustomOrder',
  CUSTOMIZATION_CODE: 'savedCustomizationCode',
} as const;

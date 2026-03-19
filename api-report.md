# Lugar Store — Project Analysis Report

---

## 1. API Base URL & Environment Configuration

| Environment | `production` flag | `apiUrl` |
|---|---|---|
| `environment.ts` (default) | `false` | `https://lugarstore.net/api` |
| `environment.development.ts` | `false` | `https://lugarstore.net/api/` *(trailing slash)* |
| `environment.production.ts` | `true` | `https://lugarstore.net/api` |
| `environment.prod.ts` | `true` | `https://lugarstore.net/api` |

**Note:** `environment.development.ts` has a trailing slash that the others don't — minor inconsistency to watch for.

A commented-out `filesUrl` exists in the dev file:
```ts
// filesUrl: 'https://lugarstore.net/uploads/',
```
This was never activated, but it confirms the uploads base path.

---

## 2. All API Endpoints

The HTTP interceptor (`http-interceptor.interceptor.ts`) prepends `environment.apiUrl` to every request that is not a `.json` file. So all paths below are **relative** — the interceptor makes them absolute.

| Method | Full resolved URL | Service | Purpose |
|---|---|---|---|
| `GET` | `/products/get_products.php` | `ProductService` | Fetch all products (paginated/filtered/sorted via query params) |
| `GET` | `/products/get_discounted_products.php` | `ProductService` | Fetch discounted products (hot deals) |
| `GET` | `/products/get_product-v2.php/?id={id}` | `ProductService` | Fetch single product detail (v2 with `images[]` array) |
| `GET` | `/products/get_products_by_categoryId.php/?categoryId={id}` | `ProductService` | Fetch related products by category |
| `GET` | `/categories/get_categories.php` | `CatigoryService` | Fetch all categories |
| `GET` | `/sub_categories/get_subcategories.php` | `SuCategoriesService` | Fetch all subcategories |
| `GET` | `/banners/get_banners.php` | `BannerService` | Fetch promotional banners |
| `GET` | `/countries/countries.php` | `ContriesService` | Fetch countries + states for checkout |
| `POST` | `/orders/create_order.php` | `OrderService` | Create a standard checkout order |
| `POST` | `/messages/create_message.php` | `ContactUsService` | Send contact form message |
| `GET` | `/materials/get_materials.php` | `CustomizationService` | Fetch material options (falls back to hardcoded data) |
| `GET` | `/addons/get_addons.php` | `CustomizationService` | Fetch add-on options (falls back to hardcoded data) |
| `POST` | `/orders/create_custom_order.php` | `CustomizationService` | Submit a custom furniture order |
| `POST` | `/orders/save_customization.php` | `CustomizationService` | Save a customization draft for later |
| `GET` | `/orders/get_saved_customization.php?code={code}` | `CustomizationService` | Load a saved customization by code |
| `POST` | `/appointments/schedule.php` | `CustomizationService` | Schedule a measurement appointment |
| `POST` | `/uploads/upload_reference_image.php` | `CustomizationService` | Upload a reference image (multipart/form-data) |

---

## 3. Response Shapes (TypeScript Interfaces)

**`GET /products/get_products.php`** — returns `Product[]` directly (no wrapper):
```ts
interface Product {
  id: number;
  title: string;
  titleAr: string;
  discountedPrice: string;   // string, not number — "0" means no discount
  description: string;
  imgOne: string;            // full URL to https://lugarstore.net/uploads/...
  imgTwo: string;
  imgThree: string;
  imgFour: string;
  videoLink: string;
  categoryId: string;        // string, not number
  subCategoryId: number;
  rating: number;
  isNew?: boolean;
  discount: number;          // percentage value e.g. 20
  originalPrice: string;     // string, cast to Number() when used
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string;
  qty: number;
  categoryName: string;
}
```

**`GET /products/get_product-v2.php`** — returns `Product_v2` (used on product detail page):
```ts
interface Product_v2 {
  id: number;
  title: string;
  titleAr: string;
  discountedPrice: string;
  description: string;
  images: string[];          // array instead of imgOne/imgTwo/imgThree/imgFour
  videoLink: string;
  categoryId: string;
  subCategoryId: number;
  categoryName: string;
  rating: number;
  isNew?: boolean;
  discount: number;
  originalPrice: string;
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string;
}
```

**`GET /categories/get_categories.php`** — returns `Category[]`:
```ts
interface Category {
  id: number;
  imgOne: string;    // full URL
  title: string;
  titleAr: string;
}
```

**`GET /sub_categories/get_subcategories.php`** — returns `SubCategory[]`:
```ts
interface SubCategory {
  id: number;
  title: string;
  titleAr: string;
}
```

**`GET /banners/get_banners.php`** — returns a wrapped response:
```ts
interface ApiResponse<T> { success: boolean; data: T; }
interface Banner {
  id: string;
  fileUrl: string;    // full URL
  visible: boolean;
  selected: boolean;
  created_at: string;
  order?: number;
}
// The service filters: banner.visible === true && banner.selected === true
```

**`POST /orders/create_order.php`** — request payload:
```ts
interface CreateOrderRequest {
  name: string;
  phoneNumber: string;
  address: string;
  state: string;
  statusId: number;   // hardcoded to 2 at checkout
  date: Date;
  email: string;
  products: { productId: number; qty: number; }[];
}
```

**`GET /countries/countries.php`** — untyped (`any[]`), but used as:
```
country.name   — string
country.states — array of { name: string }
```

---

## 4. Authentication

**None.** There is no authentication mechanism in this project:

- The HTTP interceptor only prepends the API URL — no `Authorization` header, no JWT, no API key, no token injection
- No login page, no session management, no auth guards
- No `localStorage` keys for tokens
- The API is treated as fully public

---

## 5. Angular Services — HTTP Methods Summary

| Service | File | Methods |
|---|---|---|
| `ProductService` | `services/product/product.service.ts` | `getProducts(params?)`, `get_discounted_products(params?)`, `getProduct(id)`, `getProductsByCategory(category)` |
| `CatigoryService` | `services/categories/categories.service.ts` | `getCatigories()` |
| `SuCategoriesService` | `services/sub-categories/su-categories.service.ts` | `getSubCatigories()` |
| `BannerService` | `services/banner/banner.service.ts` | `getBanners()` |
| `OrderService` | `services/order/order.service.ts` | `createOrder(payload)` |
| `ContactUsService` | `services/contacut-us/contact-us.service.ts` | `sendMessage(payload)` |
| `ContriesService` | `services/contries/contries.service.ts` | `getContries()` |
| `CustomizationService` | `services/customization/customization.service.ts` | `getMaterialOptions()`, `getAddOnOptions()`, `submitOrder()`, `saveCustomizationForLater()`, `loadSavedCustomization(code)`, `scheduleMeasurementAppointment()`, `uploadImage(file)` |
| `CartService` | `services/cart/cart.service.ts` | **No HTTP** — localStorage only |

---

## 6. Image Handling

**All product images are full absolute URLs** pointing to `https://lugarstore.net/uploads/`.

- `Product.imgOne` / `imgTwo` / `imgThree` / `imgFour` — individual fields, all full URLs
- `Product_v2.images[]` — array of full URLs (used on detail page)
- `Category.imgOne` — full URL
- `Banner.fileUrl` — full URL

**In product card template**, `imgOne` is used as primary with a local fallback:
```html
<img [src]="product.imgOne || 'assets/images/placeholder.png'" />
```

**In product detail**, `images[0]` is the selected/main image, `images.slice(0,2)` are shown in the description banner section.

**Static assets** (logo, social icons) are hardcoded as full URLs to `https://lugarstore.net/uploads/`:
```
LOGO1-lugar.svg
facebook-brands.svg
whatsapp-icon.svg
instagram-brands.svg
tiktok-brands.svg
```

---

## 7. Hardcoded Business Logic

### Price & Currency
- Currency is **Egyptian Pound (EGP)**, applied via Angular's built-in `currency` pipe:
  ```html
  {{ product.originalPrice | currency:'EGP':'symbol':'1.2-2' | addSpaceAfterCurrency }}
  ```
- `originalPrice` and `discountedPrice` are **strings** from the API, cast to `Number()` for math
- A discount exists when `Number(discountedPrice) > 0` — zero means no discount
- A custom `AddSpaceAfterCurrencyPipe` adds a space between the `EGP` symbol and the number (e.g. `EGP 2,500.00` instead of `EGP2,500.00`)

### Sorting Options
Only two sort values are implemented, hardcoded in the template dropdown:
- `priceAsc` — sorts by `Number(originalPrice)` ascending
- `priceDesc` — sorts by `Number(originalPrice)` descending
- Default sort on load: products sorted by `id` descending (`Number(b.id) - Number(a.id)`)

### Badges / Flags
These are derived from `subCategoryId`, **not** from the `isNew` field on the model:
```html
<!-- "New" badge -->
<div class="new-badge" *ngIf="product.subCategoryId == 1">
<!-- "Top" badge -->
<div class="top-badge" *ngIf="product.subCategoryId == 5">
<!-- Discount badge -->
<div class="discount-badge" *ngIf="product.discount > 0">
  -{{product.discount}}%
```
So `subCategoryId === 1` = "New" products, `subCategoryId === 5` = "Top" products.

### Pagination
- Default: **16 items per page**
- Filtering is done **client-side** — all products are fetched in one request, then sliced/filtered in memory
- Category filter compares `product.categoryId == filterData` (loose equality — `categoryId` is a string)

### Checkout
- `statusId` is hardcoded to `2` on every order
- Total = subtotal only (no shipping fee, no tax logic active)
- After successful order: localStorage is fully cleared (`localStorage.clear()`) and user is redirected to `/home`

### Brand Color
Gold: `#B88E2F` — used in component animation states and button hover styles.

---

## 8. Cart & Wishlist Storage

**100% localStorage** — no API calls for cart or wishlist.

| Key | Type | Contents |
|---|---|---|
| `shoppingCart` | `JSON.stringify(Cart[])` | `{ id, title, image, qty, price }` |
| `wishlist` | `JSON.stringify(Cart[])` | Same shape as cart |
| `currentCustomOrder` | `JSON.stringify(CustomOrder)` | Draft customization order |
| `savedCustomizationCode` | `string` | Save code returned by `/orders/save_customization.php` |

The `CartService` uses **Angular signals** (`signal<Cart[]>`) for reactivity. State is loaded from localStorage on service initialization and written back on every mutation.

---

## Summary of Things to Watch Out For

1. `categoryId` on `Product` is typed as `string` — comparisons use loose `==` not strict `===`
2. `originalPrice` / `discountedPrice` are strings but treated as numbers throughout — no dedicated `Money` type
3. Two product interfaces exist: `Product` (4 separate image fields) vs `Product_v2` (images array) — the list page uses v1, the detail page uses v2
4. `CustomizationService` directly reads `environment.apiUrl` instead of relying on the interceptor — slight inconsistency
5. Filtering/sorting is entirely client-side — the server is not used for filtering

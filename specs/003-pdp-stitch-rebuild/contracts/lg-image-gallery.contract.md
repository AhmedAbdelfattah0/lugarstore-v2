# Component Contract: `lg-image-gallery`

**File**: `src/app/features/product-detail/components/lg-image-gallery/lg-image-gallery.component.ts`
**Selector**: `lg-image-gallery`
**Role**: View — renders the product image gallery; delegates image selection up to parent

---

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | `string[]` | ✅ Yes | Array of product image URLs. Rendered up to 4 (via `SlicePipe`). |
| `selectedIndex` | `number` | ✅ Yes | Zero-based index of the currently active image. Controls main image display and active thumbnail border. |

## Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `selectImage` | `number` | Emitted when a thumbnail is clicked. Payload is the clicked image index. Parent (page) passes this to `PdpStateService.setSelectedImageIdx()`. |

---

## Rendering Behavior

- Main image: `images[selectedIndex]` at aspect-ratio `4/5`, `object-fit: cover`, background `#faf2e8`
- Thumbnails: `images | slice:0:4` in a 4-column grid, gap 16px, aspect-ratio `1/1`
- Active thumbnail: `1px solid rgba(184,142,47,0.2)` border on the thumbnail whose index matches `selectedIndex`
- Inactive thumbnails: no border
- If `images.length < 4`: only the available thumbnails are rendered (no empty cells)
- Zoom button: absolute top-right, `rgba(255,255,255,0.4)` backdrop-blur circle (presentational only — no output; zoom lightbox is out of scope)

---

## Constraints

- No service injections — pure view component
- No internal state signals
- Thumbnail click does NOT update state directly; it emits `selectImage` and waits for parent to update `selectedIndex`
- Does not handle empty `images[]` — parent must guard before rendering this component

---

## Usage Example

```html
<lg-image-gallery
  [images]="pdpState.product()!.images"
  [selectedIndex]="pdpState.selectedImageIdx()"
  (selectImage)="pdpState.setSelectedImageIdx($event)"
/>
```

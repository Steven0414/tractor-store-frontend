# MFE Decide

**Port (dev):** 4201  
**Role:** Product detail & variant selection  
**Federation role:** Remote (no exposed components — standalone page)

## Responsibilities

- Displays full product detail: name, description, category, and all available
  variants (color, motor, price, stock).
- Allows the user to select a variant (SKU) and add it to the cart.
- Renders color-based product recommendations.

## Routes

| Path | Component | Description |
|---|---|---|
| `/product/:id` | `ProductDetailComponent` | Full product detail |
| `**` | redirect → `/product/` | Catch-all |

## Pages

### ProductDetailComponent
- Reads `id` from the route param.
- Loads product detail via `ProductService`.
- Loads stock for each variant via `InventoryService`.
- Dispatches "Add to Cart" via the backend cart API.

## Services

### `ProductService`
```
GET /api/catalog/product/:id    → ProductDetail
GET /api/catalog/recommendations?skus=:csv → Product[]
```

### `InventoryService`
```
GET /api/catalog/inventory/:sku → InventoryItem
```

### `CartService` (within mfe-decide)
```
POST /api/cart/items            → Cart
```
Adds the selected SKU to the session cart.

## Stores

### `ProductStore`
```typescript
{
  product: ProductDetail | null;
  selectedSku: string | null;
  loading: boolean;
  error: string | null;
}
```

### `InventoryStore`
Tracks stock per SKU:
```typescript
{
  stockBySku: Record<string, number>;
  loading: boolean;
}
```

## Key Models

```typescript
interface ProductDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  sku: string;
  color: string;
  motor: string;
  price: number;
  imageUrl: string;
  stock: number;
}
```

# MFE Checkout

**Port (dev):** 4202  
**Role:** Cart management & order placement  
**Federation role:** Remote — exposes `./MiniCart` and `./CheckoutPage`

## Responsibilities

- Provides a **MiniCart** widget (federated) that shows the current item count
  and total to any host MFE.
- Provides the full **CheckoutPage** (federated) where the user reviews items
  and submits an order.
- Manages the session cart state (via `CartStore`) and order placement state
  (via `OrderStore`).

## Exposed Federation Remotes

| Export key | Component path | Consumed by |
|---|---|---|
| `./MiniCart` | `src/app/cart/components/mini-cart/mini-cart.component.ts` | mfe-explore header |
| `./CheckoutPage` | `src/app/checkout/pages/checkout/checkout.component.ts` | mfe-explore router |

## Routes (standalone app)

| Path | Component | Description |
|---|---|---|
| `/checkout` | `CheckoutComponent` | Full checkout form + order summary |
| `**` | redirect → `/checkout` | Catch-all |

The `CheckoutComponent` is protected by `unsavedChangesGuard` — the user is
prompted before navigating away with unsaved form data.

## Services

### `CartService`
```
GET  /api/cart        → Cart        (full cart)
GET  /api/cart/mini   → MiniCart    (lightweight summary)
POST /api/cart/items  → Cart        (add/increment item)
```

### `OrderService`
```
POST /api/orders      → PlaceOrderResponse
```

## Stores

### `CartStore`
```typescript
{
  miniCart: MiniCart | null;
  loading: boolean;
  error: string | null;
}
```

### `OrderStore`
Tracks order placement state:
```typescript
{
  loading: boolean;
  success: boolean;
  error: string | null;
}
```

## Key Models

```typescript
interface CartItem {
  sku: string; name: string;
  quantity: number; price: number; subtotal: number;
}
interface Cart {
  items: CartItem[]; itemCount: number; total: number;
}
interface MiniCart {
  itemCount: number; total: number;
}
interface AddCartItemRequest {
  sku: string; name: string; quantity: number; price: number;
}
```

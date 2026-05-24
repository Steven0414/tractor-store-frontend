# MFE Explore

**Port (dev):** 4200  
**Role:** Shell host — catalog browsing  
**Federation role:** Host

## Responsibilities

- Renders the global `Header` (including the federated `MiniCart` widget) and `Footer`.
- Provides the application router that lazy-loads pages.
- Fetches and displays home data, category product lists, and store locations.

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomeComponent` | Featured categories and products |
| `/category/:filter` | `CategoryComponent` | Products filtered by `classic`, `autonomous`, or `all` |
| `/stores` | `StoresComponent` | Store locator list |
| `**` | redirect → `/` | Catch-all |

## Pages

### HomeComponent
Displays:
- Banner title and subtitle.
- Featured category cards (links to `/category/:filter`).
- Featured product cards (links to `mfe-decide` `/product/:id`).

### CategoryComponent
- Reads `filter` from the route param (`classic` | `autonomous` | `all`).
- Fetches product list from `CatalogService.getCategoriesByFilter()`.

### StoresComponent
- Renders all store locations from `CatalogService.getStores()`.

## Services

### `CatalogService`
```
GET /api/catalog/home           → HomeData
GET /api/catalog/categories/:filter → Product[]
GET /api/catalog/stores         → Store[]
```

## Store — `CatalogStore`

Signal-based store. Shape:

```typescript
{
  homeData: HomeData | null;
  products: Product[];
  stores: Store[];
  activeFilter: 'classic' | 'autonomous' | 'all';
  loading: boolean;
  error: string | null;
}
```

## Key Models

```typescript
interface HomeData {
  bannerTitle: string;
  bannerSubtitle: string;
  featuredCategories: Category[];
  featuredProducts: Product[];
}

interface Product {
  id: string; sku: string; name: string; price: number;
  imageUrl: string; category: string; color: string; motor: string;
}

interface Store {
  id: string; name: string; address: string; city: string;
  phone: string; email: string; latitude: number; longitude: number;
  openingHours: string;
}
```

## Federation Config

`mfe-explore` is a **host** only — it does not expose any components. Shared
libraries use `singleton: true, strictVersion: true`.

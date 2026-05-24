# Architecture — Frontend

## Overview

The Tractor Store frontend implements a **Micro-Frontend (MFE)** architecture
using **Angular 19** and **Native Federation** (ESM-native module sharing). Each
microfrontend is an independent Angular application that can be developed,
tested, and deployed in isolation.

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  mfe-explore  (Shell / Host — port 4200)            │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Header  ·  Router Outlet  ·  Footer         │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │            ↓ lazy loads via Native Federation        │    │
│  │  ┌──────────────┐   ┌──────────────────────────┐   │    │
│  │  │  mfe-decide  │   │      mfe-checkout        │   │    │
│  │  │  (port 4201) │   │      (port 4202)         │   │    │
│  │  │  ProductDetail│  │  MiniCart · CheckoutPage │   │    │
│  │  └──────────────┘   └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│                         ↕ REST/JSON                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          catalog-service  (port 8080)                │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Microfrontend Responsibilities

| MFE | Role | Exposes via Federation |
|---|---|---|
| `mfe-explore` | Shell host; catalog browsing (home, categories, stores) | — |
| `mfe-decide` | Product detail & variant selection | — |
| `mfe-checkout` | Cart (mini-cart widget) & checkout page | `./MiniCart`, `./CheckoutPage` |

## Native Federation

`mfe-checkout` acts as a **remote** and exposes two components:

- **`./MiniCart`** — lightweight cart indicator consumed by `mfe-explore`'s header.
- **`./CheckoutPage`** — full checkout form loaded by `mfe-explore`'s router.

`mfe-explore` acts as the **host** and configures remote entry points in its
`federation.config.js`.

All shared Angular and RxJS libraries are set to `singleton: true` so a single
instance is shared at runtime.

## State Management

Each MFE uses **Angular Signals-based stores** (no NgRx) for local state:

| Store | MFE | Responsibility |
|---|---|---|
| `CatalogStore` | mfe-explore | Home data, products, stores, active filter |
| `ProductStore` | mfe-decide | Product detail, selected SKU |
| `InventoryStore` | mfe-decide | Stock levels per SKU |
| `CartStore` | mfe-checkout | Mini-cart summary |
| `OrderStore` | mfe-checkout | Order placement state |

## Communication with Backend

All MFEs communicate with the backend exclusively over **REST/JSON**. The base
URL `/api` is proxied by each application's nginx configuration in production,
and by the Angular dev-server proxy in development.

## Related ADRs

- [ADR-0001 — Microfrontend architecture](adr/0001-microfrontend-architecture.md)
- [ADR-0002 — Native Federation over Webpack Module Federation](adr/0002-native-federation.md)

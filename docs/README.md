# Tractor Store — Frontend Documentation

Welcome to the **Tractor Store Frontend** docs. This documentation follows the
[Docs as Code](https://www.writethedocs.org/guide/docs-as-code/) methodology:
all content is written in Markdown, versioned alongside the source code, and
reviewed through pull requests.

## Table of Contents

| Document | Description |
|---|---|
| [Architecture](architecture.md) | Microfrontend architecture and Native Federation setup |
| [MFE Explore](mfe-explore.md) | Catalog & browsing microfrontend |
| [MFE Decide](mfe-decide.md) | Product detail microfrontend |
| [MFE Checkout](mfe-checkout.md) | Cart & checkout microfrontend |
| [Development Guide](development.md) | Local setup and development workflow |
| [Deployment Guide](deployment.md) | Docker and production deployment |
| [ADR Index](adr/README.md) | Architecture Decision Records |

## Project Overview

The Tractor Store frontend is a **Micro-Frontend (MFE)** application composed of
three independent Angular 19 applications that collaborate through
[Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation).

```
tractor-store-frontend/
├── mfe-explore/      # Shell + catalog browsing (port 4200)
├── mfe-decide/       # Product detail page    (port 4201)
└── mfe-checkout/     # Cart & checkout        (port 4202)
```

## Contributing to Docs

1. Edit or create Markdown files inside `docs/`.
2. Open a pull request — the same review process applies to docs as to code.
3. Prefer short, focused documents over long monolithic pages.
4. Use [ADRs](adr/README.md) to record significant architectural decisions.

# ADR-0001 — Adopt Microfrontend Architecture

## Status

Accepted

## Context

The Tractor Store application covers three distinct user journeys: **browsing
the catalog** (Explore), **evaluating a product** (Decide), and **purchasing**
(Checkout). As the team grows, tight coupling in a monolithic SPA would slow
down independent development and deployment of these journeys.

## Decision

Split the frontend into three independently deployable Angular applications
(`mfe-explore`, `mfe-decide`, `mfe-checkout`), each owned by a separate
concern. `mfe-explore` acts as the shell/host that composes the other two.

## Consequences

**Positive:**
- Teams can develop, test, and deploy each MFE independently.
- Failures in one MFE are isolated and do not crash the entire application.
- Each MFE can evolve its dependencies at its own pace.

**Negative:**
- More complex local development setup (three dev servers).
- Shared library version management requires coordination via Native Federation
  singleton configuration.
- Initial load may require fetching multiple module bundles.

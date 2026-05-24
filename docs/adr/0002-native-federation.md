# ADR-0002 — Use Native Federation for MFE Integration

## Status

Accepted

## Context

Module Federation (Webpack) is the traditional approach for MFE runtime
integration in Angular. However, Angular 19 has moved to an ESM-native build
pipeline (esbuild), making Webpack-based federation a mismatch. An alternative
that works natively with ESM and Angular's new build system was needed.

## Decision

Use **`@angular-architects/native-federation`** instead of Webpack Module
Federation. `mfe-checkout` is the remote and exposes `./MiniCart` and
`./CheckoutPage`. `mfe-explore` is the host and loads these remotes at runtime
via ES module imports.

## Consequences

**Positive:**
- Compatible with Angular 19's esbuild pipeline.
- No Webpack configuration overhead.
- Leverages native browser ES module loading (`es-module-shims` polyfill for
  older browsers).
- Singleton sharing of Angular/RxJS prevents duplicate instances.

**Negative:**
- `native-federation` ecosystem is less mature than Webpack Module Federation.
- `es-module-shims` adds a small runtime polyfill (~25 kB).
- `strictVersion: true` means a version mismatch will throw at runtime.

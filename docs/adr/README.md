# Architecture Decision Records — Frontend

An **Architecture Decision Record (ADR)** captures a significant architectural
decision, its context, and its consequences.

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-microfrontend-architecture.md) | Adopt Microfrontend Architecture | Accepted |
| [0002](0002-native-federation.md) | Use Native Federation for MFE Integration | Accepted |

## Format

Each ADR follows this structure:

```
# ADR-XXXX — Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-YYYY

## Context
Why is a decision needed?

## Decision
What was decided?

## Consequences
What are the trade-offs?
```

## Creating a New ADR

1. Copy `0001-microfrontend-architecture.md` as a template.
2. Name the file `NNNN-short-title.md` (next sequential number).
3. Fill in the sections and set status to `Proposed`.
4. Open a pull request for team review.
5. Update this index once merged.

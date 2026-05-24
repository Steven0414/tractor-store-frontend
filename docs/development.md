# Development Guide — Frontend

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 22 |
| npm | ≥ 10 |
| Angular CLI | 19.x (`npm i -g @angular/cli`) |

## Repository Structure

```
tractor-store-frontend/
├── mfe-explore/    # Shell + catalog (port 4200)
├── mfe-decide/     # Product detail  (port 4201)
├── mfe-checkout/   # Cart & checkout (port 4202)
└── docs/           # This documentation
```

## Initial Setup

Run the following once per MFE to install dependencies:

```bash
cd mfe-explore  && npm install
cd ../mfe-decide   && npm install
cd ../mfe-checkout && npm install
```

## Running Locally

Each MFE must be started on its dedicated port so Native Federation can resolve
remotes.

```bash
# Terminal 1 — checkout remote (must start before the shell)
cd mfe-checkout && ng serve --port 4202

# Terminal 2 — decide remote
cd mfe-decide && ng serve --port 4201

# Terminal 3 — explore shell/host
cd mfe-explore && ng serve --port 4200
```

Open **http://localhost:4200** in your browser.

> **Note:** The backend (`catalog-service`) must also be running on port 8080.
> All `/api` requests from the Angular dev server are proxied to
> `http://localhost:8080`.

## Running Tests

```bash
cd mfe-explore  && ng test
cd mfe-decide   && ng test
cd mfe-checkout && ng test
```

## Building for Production

```bash
cd mfe-explore  && ng build --configuration production
cd mfe-decide   && ng build --configuration production
cd mfe-checkout && ng build --configuration production
```

Build artifacts are output to `dist/<mfe-name>/`.

## Code Style

- TypeScript strict mode is enabled for all MFEs.
- Use Angular Signals for state management — avoid NgRx.
- Prefer standalone components over NgModules.
- Follow the existing `core/models` → `core/services` → `store` → `pages/components` layering.

## Adding a New Component

```bash
cd mfe-<name>
ng generate component <path/component-name>
```

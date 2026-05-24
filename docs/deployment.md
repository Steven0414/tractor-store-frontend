# Deployment Guide — Frontend

## Docker Images

Each MFE has its own `Dockerfile` using a **two-stage build**:

1. **Builder** (`node:22-alpine`) — installs dependencies and runs `ng build --configuration production`.
2. **Server** (`nginx:1.27-alpine`) — serves the static build from `/usr/share/nginx/html`.

### Building Images

```bash
# From the repo root
docker build -t tractor-store/mfe-explore:latest   ./mfe-explore
docker build -t tractor-store/mfe-decide:latest    ./mfe-decide
docker build -t tractor-store/mfe-checkout:latest  ./mfe-checkout
```

### Running Containers

```bash
docker run -p 4200:80 tractor-store/mfe-explore:latest
docker run -p 4201:80 tractor-store/mfe-decide:latest
docker run -p 4202:80 tractor-store/mfe-checkout:latest
```

## nginx Configuration

Each MFE ships with an `nginx.conf` that:
- Serves static files from `/usr/share/nginx/html`.
- Falls back to `index.html` for all routes (SPA routing).
- Proxies `/api` requests to the backend service.

## Environment Variables

Angular apps are built with environment-specific files
(`src/environments/environment.ts`). For production, set the backend API URL in
the appropriate environment file before building, or use runtime configuration
injection.

## Health Check

Each Docker container exposes a health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
```

## Port Summary

| Service | Container port | Default host port |
|---|---|---|
| mfe-explore | 80 | 4200 |
| mfe-decide | 80 | 4201 |
| mfe-checkout | 80 | 4202 |
| catalog-service | 8080 | 8080 |

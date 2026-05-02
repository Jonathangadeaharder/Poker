# Highlight.io Local Setup

Self-hosted Highlight.io for local development telemetry.

## Prerequisites

- Docker Desktop (includes Docker Compose)
- At least 4 GB RAM allocated to Docker

## Start Local Highlight

```bash
npm run highlight:start
```

This spins up ClickHouse, Kafka, Redis, Postgres, and the Highlight backend.

## Access the Dashboard

Open http://localhost:3000 in your browser.

## View Logs

```bash
npm run highlight:logs
```

## Stop

```bash
npm run highlight:stop
```

Data persists in Docker volumes between restarts. To wipe everything:

```bash
docker compose -f docker-compose.highlight.yml down -v
```

## How It Works

`src/config/highlight.ts` configures an OpenTelemetry exporter that sends traces to `http://localhost:8082`. The `hookConsole()` call in `App.js` intercepts `console.log/warn/error` and forwards them as Highlight logs.

No cloud account or API key needed.

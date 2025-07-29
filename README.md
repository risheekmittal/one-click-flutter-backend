# One‑Click Flutter Backend

Now with **Postgres persistence, JWT auth, Jest tests, and custom domain guide**.

## Quick local run

```bash
cd api
npm install
npm run dev
```

Login → token:

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret"}'
```

Response: `{"token":"<jwt>"}`

Add todo:

```bash
curl -X POST http://localhost:8080/todos \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Read docs"}'
```

## Persistence on Render

1. Render → **New → PostgreSQL** → Free.
2. Copy **Internal Database URL** → Web Service → **Environment** → `DATABASE_URL`.
3. Add `PGSSL=true` env var (Render requires SSL).
4. Deploy – table is auto‑created.

No `DATABASE_URL`? API falls back to in‑memory.

## Tests

```bash
cd api
npm test
```

## Custom domain (Render)

Settings → Custom Domains → Add → update DNS → Render issues HTTPS.

## Deployment matrix

* **Render Free** – Node env or Dockerfile.render
* **Cloud Run** – see README.v2
* **Cloudflare Workers** – rewrite handler
* **AWS Fargate** – templates in `ecs/`

_Generated 2025-07-29_

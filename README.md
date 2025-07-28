# One‑Click Flutter Backend (Render Free)

Minimal Node.js REST API with `/health` and `/todos`. Designed to deploy **free** on **Render**.
You can also reuse the same code for **Google Cloud Run** or **AWS ECS Fargate** later.

## Deploy to Render (Free)

1. Create a GitHub repo and push this project.
2. In Render: **New → Web Service → Connect GitHub**.
3. Settings:
   - **Root directory**: `api`
   - **Build command**: `npm ci`
   - **Start command**: `node src/index.js`
   - **Instance type**: **Free**
   - **Health Check Path**: `/health` (recommended)
   - No env vars required; Render injects `PORT` which the app uses.

After deploy, open:

- `GET /health` → 200 OK
- `GET /todos`
- `POST /todos` with JSON body `{ "title": "My task", "done": false }`

### Free-tier behavior
- Free services may **sleep when idle**; the first request after sleep will be slower.
- You have **750 instance hours/month per workspace**. If you exhaust them, services pause until next month.

## Local development

```bash
cd api
npm ci
npm run dev
# or
npm run start
```

Visit `http://localhost:8080/health`.

## Docker (optional)

```bash
docker build -t oneclick:dev ./api
docker run -p 8080:8080 oneclick:dev
```

## Optional: Cloud Run

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT
gcloud builds submit api --tag gcr.io/YOUR_PROJECT/oneclick
gcloud run deploy oneclick --image gcr.io/YOUR_PROJECT/oneclick --region asia-south1 --allow-unauthenticated --port 8080
```

## Optional: AWS ECS Fargate (paid unless using credits)

See `ecs/task-definition.json`, `ecs/service-settings.md`, and `.github/workflows/deploy.yml` for a CI/CD pipeline using GitHub Actions + OIDC.
Replace ARNs and image URIs before using.

---
_Generated on 2025-07-28_

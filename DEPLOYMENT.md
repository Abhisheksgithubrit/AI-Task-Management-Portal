# Deployment Guide (Vercel + Render + Railway MySQL)

Your app has **3 parts**:

| Part | Host | Why |
|------|------|-----|
| **Frontend** (React) | **Vercel** | Assignment suggests Vercel; perfect for Vite/React |
| **Backend** (Spring Boot) | **Render** | Vercel cannot run Java Spring Boot servers |
| **Database** (MySQL) | **Railway** or **Aiven** | Cloud MySQL for production |

---

## Step 0 — Push code to GitHub

1. Create a repo on [GitHub](https://github.com/new)
2. In project folder:

```powershell
cd d:\ai-task-management-portal
git init
git add .
git commit -m "AI Task Management Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do **not** commit `.env` files with passwords. They are in `.gitignore`.

---

## Step 1 — Cloud MySQL (Railway)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project** → **Provision MySQL**
3. Click MySQL service → **Variables** tab → copy:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

4. Build JDBC URL (example):

```
jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE?useSSL=true&requireSSL=true&serverTimezone=UTC
```

Replace `MYSQLHOST`, etc. with real values.

---

## Step 2 — Backend on Render

1. Go to [render.com](https://render.com) → Sign up
2. **New +** → **Web Service** → Connect your GitHub repo
3. Settings:

| Setting | Value |
|---------|--------|
| **Name** | `task-portal-api` |
| **Root Directory** | `backend` |
| **Runtime** | Docker *or* Native (see below) |

### Option A — Native (Java)

| Setting | Value |
|---------|--------|
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -jar target/task-management-portal-1.0.0.jar` |

### Environment variables (Render → Environment)

| Key | Value |
|-----|--------|
| `SPRING_DATASOURCE_URL` | Your Railway JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Railway MySQL user |
| `SPRING_DATASOURCE_PASSWORD` | Railway MySQL password |
| `JWT_SECRET` | Long random string (32+ chars) |
| `GEMINI_API_KEY` | Your Google AI Studio key |
| `APP_CORS_ALLOWED_ORIGINS` | `https://YOUR-APP.vercel.app` (add after Vercel deploy) |

4. **Create Web Service** → wait until **Live**
5. Copy URL, e.g. `https://task-portal-api.onrender.com`

Test: open `https://task-portal-api.onrender.com/api/health` → should show `{"status":"UP"}`

> **Note:** Free Render sleeps after inactivity; first request may take 30–60 seconds.

---

## Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import your GitHub repo
3. Settings:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. **Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_API_BASE_URL` | `https://task-portal-api.onrender.com` (your Render URL, no trailing slash) |

5. Click **Deploy**
6. Copy Vercel URL, e.g. `https://ai-task-portal.vercel.app`

---

## Step 4 — Connect frontend ↔ backend (CORS)

1. Go back to **Render** → your backend service → **Environment**
2. Update `APP_CORS_ALLOWED_ORIGINS`:

```
https://YOUR-APP.vercel.app,http://localhost:5173
```

3. **Save** → Render redeploys automatically

---

## Step 5 — Test live app

1. Open your **Vercel URL**
2. Register a new account
3. Create a task + Generate AI
4. Submit assignment links:
   - GitHub repo
   - Vercel URL (frontend)
   - Render URL (backend API)

---

## Submission example

```
Frontend: https://ai-task-portal.vercel.app
Backend API: https://task-portal-api.onrender.com
GitHub: https://github.com/yourname/ai-task-management-portal
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Frontend loads but login fails | Check `VITE_API_BASE_URL` on Vercel; redeploy after changing |
| CORS error in browser console | Add exact Vercel URL to `APP_CORS_ALLOWED_ORIGINS` on Render |
| Backend 503 / slow | Render free tier waking up — wait 1 minute |
| Database connection failed | Verify JDBC URL, username, password on Render |
| AI not working | Set `GEMINI_API_KEY` on Render |

---

## Local vs production

| | Local | Production |
|--|-------|------------|
| Frontend | http://localhost:5173 | https://xxx.vercel.app |
| Backend | http://localhost:8080 | https://xxx.onrender.com |
| Database | localhost MySQL | Railway MySQL |

# Vercel Deployment Guide: TicketFlow

This guide explains how to deploy both the Express backend (as a serverless function) and the React frontend on **Vercel**. 

We have prepared the code for this deployment:
- Created a serverless entry handler in [backend/api/index.js](file:///Users/maryamnawas/Documents/Ticket%20Management/backend/api/index.js) and configured routing in [backend/vercel.json](file:///Users/maryamnawas/Documents/Ticket%20Management/backend/vercel.json).
- Configured SPA route rewrites in [frontend/vercel.json](file:///Users/maryamnawas/Documents/Ticket%20Management/frontend/vercel.json) to support client-side routing on refreshes.
- Optimized database connections in [db.js](file:///Users/maryamnawas/Documents/Ticket%20Management/backend/src/config/db.js) to reuse existing Mongoose connections across serverless invocations.

---

## Step 1: Push latest changes to GitHub

Make sure all recent configuration files (`vercel.json`, `index.js`, and database optimizations) are pushed to your remote repository:
```bash
git add .
git commit -m "chore: add Vercel deployment configurations"
git push origin main
```

---

## Step 2: Deploy the Backend on Vercel

> [!WARNING]
> **CRITICAL STEP: ROOT DIRECTORY**
> In Vercel, since this is a monorepo, you **MUST** change the **Root Directory** setting to `backend` during project creation. If you do not do this, Vercel will attempt to deploy the root folder as a static site, resulting in a **404 NOT_FOUND** error for all API paths.

1. Go to your **Vercel Dashboard** and click **Add New** -> **Project**.
2. Select your repository: `ticker_management_system` (or whatever your repo name is).
3. In the project settings:
   - **Project Name**: `ticketflow-backend` (or similar)
   - **Framework Preset**: Select **Other**
   - **Root Directory**: Select **`backend`**
4. Expand the **Environment Variables** section and add these exact key-value pairs:
   - **`MONGO_URI`**: `mongodb+srv://maryamnawas03_db_user:jtGgUzzD3d1RZmAt@cluster0.7tudo2p.mongodb.net/ticket_management?retryWrites=true&w=majority&appName=Cluster0`
   - **`JWT_SECRET`**: `d2c88f7b7e63b655f4625b169527cf664de9f1a238e8888b56345ecb3eb946fc` (A secure random secret key)
   - **`JWT_EXPIRY`**: `7d`
   - **`NODE_ENV`**: `production`
   - **`FRONTEND_URL`**: `https://your-frontend-project.vercel.app` (You can update this later once your frontend is deployed)
5. Click **Deploy**.
6. Once deployed, copy your backend URL (e.g., `https://ticketflow-backend.vercel.app`). Test it by opening `https://ticketflow-backend.vercel.app/api/health` or `https://ticketflow-backend.vercel.app/` in your browser. It should return a successful JSON message like:
   `{"success":true,"message":"Ticket Management System API is running"}`

---

### Troubleshooting a 404: NOT_FOUND Error on Deployment
If your deployed URL shows a Vercel `404: NOT_FOUND` page:
1. Go to your Vercel Dashboard, select your project (`ticketflow-backend`).
2. Go to **Settings** -> **General**.
3. Under **Root Directory**, make sure it is set to `backend` (if it was blank or `.`, click **Edit**, type `backend`, and click **Save**).
4. Go to **Deployments**, click the three dots on the latest deployment, and click **Redeploy** (ensure you check the box to clean cache if prompted).
5. This will rebuild the project with the `backend` context, compiling the serverless function in `api/index.js` correctly.

---

## Step 3: Deploy the Frontend on Vercel

1. Return to the Vercel Dashboard and click **Add New** -> **Project**.
2. Select the same repository: `ticker_management_system`.
3. In the project settings:
   - **Project Name**: `ticketflow` (or similar)
   - **Framework Preset**: Select **Vite** (Vercel will auto-detect Vite)
   - **Root Directory**: Select **`frontend`**
   - **Build & Development Settings**: Keep defaults (Build Command: `npm run build`, Output Directory: `dist`).
4. Expand the **Environment Variables** section and add:
   - `VITE_API_BASE_URL`: `https://ticketflow-backend.vercel.app/api` (Use your deployed backend URL from Step 2, appending `/api`)
5. Click **Deploy**.

---

## Step 4: Finalize Cors Configuration

To ensure secure cross-origin requests between your frontend and backend:
1. Go to your **Vercel Backend Project** settings -> **Environment Variables**.
2. Update the `FRONTEND_URL` environment variable value to match your actual deployed Vercel frontend URL (e.g. `https://ticketflow.vercel.app`).
3. Redeploy your backend on Vercel (or trigger a new build) to apply the updated origin.

Your full-stack TicketFlow application is now fully deployed and accessible in production on Vercel!

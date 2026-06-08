# TicketFlow: Role-Based Ticket Management System

TicketFlow is a full-stack MERN application for managing support tickets with role-based access control (RBAC). It is designed to be clean, fast, and status-focused, allowing users to create tickets, agents to manage their assigned queue, and admins to oversee the entire system.

---

## ✨ Features by Role

### 👤 User (Customer)
- **Create Tickets:** File issues with a category (Bug, Feature, Billing, etc.) and priority.
- **Track Status:** Monitor the progress of submitted tickets in real-time.
- **Conversations:** Discuss issues directly with agents by adding comments.

### 🎧 Support Agent
- **Assigned Queue:** View and work on tickets assigned to you by an admin.
- **Manage Progress:** Update ticket statuses as you work toward resolution.
- **Customer Chat:** Respond directly to customer inquiries on the ticket timeline.

### 👑 System Administrator
- **Control Center:** Access system-wide metrics and user directories.
- **RBAC Management:** Change user roles (User/Agent/Admin) and suspend or activate accounts.
- **Ticket Assignment:** Assign incoming tickets to available support agents.
- **System Overseer:** Full CRUD access, including ticket deletion.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Redux Toolkit (State Management), React Router v6, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, JWT (Authentication), bcrypt (Password Hashing)
- **Database:** MongoDB Atlas, Mongoose (ODM)

---

## ⚙️ Environment Variables

Create a `.env` file in the root of both folders using these templates:

### Backend (`/backend/.env`)
```bash
# Database
MONGO_URI=mongodb+srv://maryamnawas03_db_user:jtGgUzzD3d1RZmAt@cluster0.7tudo2p.mongodb.net/ticket_management?retryWrites=true&w=majority&appName=Cluster0

# Server
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (`/frontend/.env`)
```bash
# API Base Endpoint
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Local Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
*Runs locally on `http://localhost:3000`*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs locally on `http://localhost:5173` (or the next available port)*

---

## 📝 Test Credentials

Once the database is seeded, you can log in using these default accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `Admin@123` |
| **Agent** | `agent@test.com` | `Agent@123` |
| **User** | `user@test.com` | `User@123` |

---

## 🚀 Vercel Deployment Guide

Deploying this monorepo to Vercel requires setting up two separate projects: one for the backend API and one for the frontend UI.

### 1. Deploy the Backend API
1. On your Vercel Dashboard, click **Add New** -> **Project** and select your repository.
2. Configure these settings:
   - **Project Name:** `ticketflow-backend` (or similar)
   - **Framework Preset:** Select **Other**
   - **Root Directory:** Select **`backend`** ⚠️ *(Critical: Do not leave as root `.`, otherwise routing will fail)*
3. Add the following Environment Variables:
   - `MONGO_URI`: `mongodb+srv://maryamnawas03_db_user:jtGgUzzD3d1RZmAt@cluster0.7tudo2p.mongodb.net/ticket_management?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `d2c88f7b7e63b655f4625b169527cf664de9f1a238e8888b56345ecb3eb946fc` *(or your own secure string)*
   - `JWT_EXPIRY`: `7d`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-project.vercel.app` *(update this later once your frontend is live)*
4. Click **Deploy**. Copy the generated URL (e.g. `https://ticketflow-backend.vercel.app`).

### 2. Deploy the Frontend UI
1. Go back to Vercel, click **Add New** -> **Project**, and select the same repository.
2. Configure these settings:
   - **Project Name:** `ticketflow-frontend` (or similar)
   - **Framework Preset:** Select **Vite**
   - **Root Directory:** Select **`frontend`**
3. Add the following Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-project.vercel.app/api` *(replace with your backend URL from Step 1, appending `/api`)*
4. Click **Deploy**.

### 3. Connect CORS
1. Copy your live frontend Vercel URL (e.g. `https://ticketflow-frontend.vercel.app`).
2. Go to your **Backend Project** settings in Vercel -> **Environment Variables**.
3. Update `FRONTEND_URL` to match your frontend Vercel URL.
4. Go to **Deployments** on the backend project and trigger a **Redeploy** so it loads the new variable.

---

## 💡 Under-the-Hood Technical Details

### 🔄 Dynamic CORS matching for Preview Branches
To make development seamless, the backend CORS setup in `app.js` uses a dynamic regular expression matching `ticketflow-` subdomains:
```javascript
/^https:\/\/ticketflow-.*\.vercel\.app$/
```
This automatically permits CORS requests from any preview branch link that Vercel generates when you push commits, saving you from having to update environment variables every time you push to git.

### 📦 Vite Environment Variable Injection
Vite environment variables (prefixed with `VITE_`) are baked into static files at **build time**. If you update `VITE_API_BASE_URL` in the Vercel dashboard, you **must trigger a new redeployment of the frontend** so it compiles the new API endpoint into the production bundle.

### 🔌 Serverless DB Connection Pooling
In serverless environments (like Vercel), server instances spin up and down dynamically. To prevent MongoDB from running out of database connection sockets, `db.js` reuses the active connection state:
```javascript
if (mongoose.connection.readyState >= 1) return mongoose.connection;
```
This prevents cold start delays and stops connection leaks.

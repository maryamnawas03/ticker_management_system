# Role-Based Ticket Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing support tickets with role-based access control. Users can create tickets, agents can manage assigned tickets, and admins can oversee the entire system.

## 🎯 Project Overview

This is a comprehensive ticket management system demonstrating:
- **Authentication**: JWT-based secure login/register
- **Role-Based Access Control**: Admin, Agent, and User roles with different permissions
- **Ticket Management**: Full CRUD operations with status tracking and comments
- **Dashboard Statistics**: Role-specific metrics and analytics
- **Clean Architecture**: Separation of concerns with controllers, services, and middleware

## ✨ Key Features

### Admin
- View all tickets and dashboard statistics
- Manage users and identify agents
- Assign tickets to agents
- Update ticket status
- Manage system-wide configurations

### Agent
- View assigned tickets
- Update ticket progress
- Add comments
- Track and manage support work

### User
- Create and manage own tickets
- View ticket history
- Add comments to conversations
- Track ticket status

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vanilla CSS** - Styling (custom design system in index.css)
- **Vite** - Build tool

## 📁 Project Structure

```
ticket-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, role, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API calls
│   │   ├── app/             # Redux store
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Redux slices
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route protection
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['Admin', 'Agent', 'User'] (default: 'User'),
  status: Enum ['Active', 'Inactive'] (default: 'Active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Model
```javascript
{
  ticketNumber: String (auto-generated, unique),
  title: String (required),
  description: String (required),
  category: Enum ['Bug', 'Feature Request', 'Technical Issue', 'Payment Issue', 'Account Issue', 'Other'],
  priority: Enum ['Low', 'Medium', 'High', 'Urgent'],
  status: Enum ['Open', 'In Progress', 'Resolved', 'Closed'],
  assignedTo: ObjectId (Agent reference),
  createdBy: ObjectId (User reference),
  comments: [{
    user: ObjectId,
    message: String,
    createdAt: Date
  }],
  statusHistory: [{
    status: String,
    changedBy: ObjectId,
    changedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/agents` - Get all agents
- `GET /api/users/:id` - Get specific user
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets (role-based)
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PATCH /api/tickets/:id/status` - Update ticket status
- `PATCH /api/tickets/:id/assign` - Assign ticket to agent
- `POST /api/tickets/:id/comments` - Add comment
- `DELETE /api/tickets/:id/comments/:commentId` - Delete comment

### Dashboard
- `GET /api/dashboard/stats` - Get statistics (role-based)

## ⚙️ Environment Variables

### Backend (.env)
```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket_management

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Application will run on `http://localhost:5173`

## 📝 Test Credentials

Admin:
admin@test.com / Admin@123

Agent:
agent@test.com / Agent@123

User:
user@test.com / User@123

## 🔄 Development Workflow

### Backend Development
```bash
cd backend
npm run dev          # Start with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start with HMR
npm run build        # Build for production
npm run preview      # Preview build
```

## 🧪 Testing

### Backend API Testing
- Use Postman or similar tool
- Import API collection from `/docs` (if available)
- Test endpoints with provided credentials

### Frontend Testing
- All pages test with different roles
- Verify menu visibility based on role
- Test protected routes



## 📋 Project Milestones Completion Status

### ✅ Day 1: Foundation & Setup
- [x] Initialised MVC project architecture for Express backend and Vite React frontend.
- [x] Installed and configured Mongoose schemas for Users and Tickets.
- [x] Set up database connection logic to MongoDB Atlas.
- [x] Initialised local git repository and staged baseline structure.

### ✅ Day 2: Authentication & Routing
- [x] Implemented JWT-based session tokens with password hashing using bcrypt.
- [x] Configured role-based access control middleware (`Admin`, `Agent`, `User`).
- [x] Built frontend Register & Login screens with state hydration via Redux.
- [x] Wired protected route guards for client-side navigation security.

### ✅ Day 3: Ticket CRUD & API Integration
- [x] Implemented Ticket creation backend service and validation criteria.
- [x] Wired ticket list query handlers to support role-specific scope (Admin sees all, Agent sees assigned, User sees own).
- [x] Built single ticket details view layout with full historical audits.
- [x] Integrated backend api endpoints with frontend React components.

### ✅ Day 4: Ticket Operations & Interactive Discussion
- [x] Added ticket modification and ticket deletion (restricted by role).
- [x] Implemented ticket status transition log and historical audit tracking.
- [x] Created agent assignment controls for Admins.
- [x] Built discussion comments feed allowing users and agents to add and delete comments (restricted to authors and admins).

### ✅ Day 5: Dashboard Statistics, Search, Filters & Sorting
- [x] Developed dynamic dashboard statistics API calculating role-specific ticket states.
- [x] Wired search engine matching title, description, or Ticket Number.
- [x] Added multi-attribute drop-down filters (Status, Priority, Category).
- [x] Implemented sort ordering criteria (Newest, Oldest, Title A-Z/Z-A, Status A-Z/Z-A).
- [x] Configured paginated list fetches with custom page controllers.
- [x] Styled form validations, error fields, loading states, and empty states.

### ✅ Day 6: User Management, UI Polish & Deployment
- [x] Created User Management control center (Admin-only) for changing roles and activating/deactivating accounts.
- [x] Built modern NotFound 404 page routing with dashboard redirect.
- [x] Customised scrollbars and polished transition states in `index.css`.
- [x] Standardised `.env.example` templates for deployment security.
- [x] Configured client routing rewrites (`vercel.json`) for SPA routing support.

---

## 🚀 Vercel Deployment Guide

This guide explains how to deploy both the Express backend (as a serverless function) and the React frontend on **Vercel**. 

### 1. Backend Deployment (Vercel)

> [!WARNING]
> **CRITICAL STEP: ROOT DIRECTORY**
> In Vercel, since this is a monorepo, you **MUST** change the **Root Directory** setting to `backend` during project creation. If you do not do this, Vercel will attempt to deploy the root folder as a static site, resulting in a **404 NOT_FOUND** error for all API paths.

1. Go to your **Vercel Dashboard** and click **Add New** -> **Project**.
2. Select your repository: `ticker_management_system` (or your repository name).
3. In the project settings:
   - **Project Name**: `ticketflow-backend` (or similar)
   - **Framework Preset**: Select **Other**
   - **Root Directory**: Select **`backend`**
4. Expand the **Environment Variables** section and add these exact key-value pairs:
   - **`MONGO_URI`**: `mongodb+srv://maryamnawas03_db_user:jtGgUzzD3d1RZmAt@cluster0.7tudo2p.mongodb.net/ticket_management?retryWrites=true&w=majority&appName=Cluster0`
   - **`JWT_SECRET`**: `d2c88f7b7e63b655f4625b169527cf664de9f1a238e8888b56345ecb3eb946fc`
   - **`JWT_EXPIRY`**: `7d`
   - **`NODE_ENV`**: `production`
   - **`FRONTEND_URL`**: `https://your-frontend-project.vercel.app` (You can update this later once your frontend is deployed)
5. Click **Deploy**.
6. Once deployed, copy your backend URL (e.g., `https://ticketflow-backend.vercel.app`).

#### Troubleshooting a 404: NOT_FOUND Error on Deployment
If your deployed URL shows a Vercel `404: NOT_FOUND` page:
1. Go to your Vercel Dashboard, select your project (`ticketflow-backend`).
2. Go to **Settings** -> **General**.
3. Under **Root Directory**, make sure it is set to `backend` (if it was blank or `.`, click **Edit**, type `backend`, and click **Save**).
4. Go to **Deployments**, click the three dots on the latest deployment, and click **Redeploy** (select "clean cache" if prompted).

---

### 2. Frontend Deployment (Vercel)

1. Return to the Vercel Dashboard and click **Add New** -> **Project**.
2. Select the same repository.
3. In the project settings:
   - **Project Name**: `ticketflow-frontend` (or similar)
   - **Framework Preset**: Select **Vite** (Vercel will auto-detect Vite)
   - **Root Directory**: Select **`frontend`**
   - **Build & Development Settings**: Keep defaults (Build Command: `npm run build`, Output Directory: `dist`).
4. Expand the **Environment Variables** section and add:
   - `VITE_API_BASE_URL`: `https://your-backend-project.vercel.app/api` (Use your deployed backend URL from Step 1, appending `/api`)
5. Click **Deploy**.

---

### 3. Finalise CORS Configuration

To ensure secure cross-origin requests between your frontend and backend:
1. Go to your **Vercel Backend Project** settings -> **Environment Variables**.
2. Update the `FRONTEND_URL` environment variable value to match your actual deployed Vercel frontend URL (e.g. `https://ticketflow-frontend.vercel.app`).
3. Redeploy your backend on Vercel to apply the updated origin.

Your full-stack TicketFlow application is now fully deployed and accessible in production on Vercel!

---

## 💡 Not-So-Obvious Technical Details & Pro Tips

Here are a few subtle, non-obvious engineering decisions and tricks implemented in this repository that make it robust and easy to deploy:

### 1. Dynamic Wildcard CORS for Vercel Preview Deployments
- **The Problem:** In Vercel, every time you push to a git branch, Vercel spawns a new frontend URL (e.g. `ticketflow-frontend-git-somebranch-username.vercel.app`). Hardcoding `FRONTEND_URL` in the backend CORS setting would block these preview links from connecting.
- **The Solution:** The backend's CORS policy in `app.js` is configured with a dynamic regular expression:
  ```javascript
  /^https:\/\/ticketflow-.*\.vercel\.app$/
  ```
  This automatically allows cross-origin requests from **any** preview branch domain generated for this project on Vercel.

### 2. Vite Environment Variables are Build-Time Baked
- **The Problem:** Changing a Vite environment variable (like `VITE_API_BASE_URL`) in the Vercel dashboard will **not** take effect immediately in your browser because static React assets are built once.
- **The Solution:** The frontend project **must be redeployed** in Vercel to rebuild and inject the updated API url directly into the production JS bundle.

### 3. Serverless DB Connection Pooling Guard
- **The Problem:** In serverless environments (like Vercel functions), Node.js instances spin up and down constantly. Opening a new database connection on every request would quickly exhaust MongoDB's connection pool.
- **The Solution:** Inside `db.js`, we query Mongoose's state before creating a connection:
  ```javascript
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  ```
  This reuses the existing active connection database socket across serverless invocations.

---

**Developer**: Maryam Nawas
**Status**: Project Completed ✅
**Last Updated**: June 10, 2026


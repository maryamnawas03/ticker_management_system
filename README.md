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
- **Tailwind CSS** - Styling
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
- `GET /api/users/agents` - Get all agents
- `GET /api/users/:id` - Get specific user
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status

### Tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets` - List tickets (role-based)
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PATCH /api/tickets/:id/status` - Update ticket status
- `PATCH /api/tickets/:id/assign` - Assign ticket to agent
- `POST /api/tickets/:id/comments` - Add comment

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

After seeding test users, use these credentials:

### Admin
```
Email: admin@test.com
Password: Admin@123
```

### Agent
```
Email: agent@test.com
Password: Agent@123
```

### User
```
Email: user@test.com
Password: User@123
```

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

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
Already hosted - just update connection string in production

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

## 🚀 Deployment Instructions

### 📦 Backend Deployment (Render / Railway)
1. **Repository Setup:** Push the repository to GitHub.
2. **Web Service Setup:** Create a new Web Service on Render, linking your GitHub repository.
3. **Root Directory:** Set the Root Directory to `backend`.
4. **Build & Start Commands:**
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables:** Define the following variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `PORT`: `10000` (or leave default for Render).
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A secure, randomly generated string.
   - `JWT_EXPIRY`: `7d`
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`).

### 📦 Frontend Deployment (Vercel)
1. **Project Setup:** Link your repository to a new project in Vercel.
2. **Build Configurations:**
   - Framework Preset: `Other` (or Vite if auto-detected).
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables:** Define the API url:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`).
4. **Routing Support:** The provided `vercel.json` file handles rewrites to keep single-page navigation functional when users reload custom URLs.

---

**Status**: Project Completed ✅
**Last Updated**: June 6, 2026


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

## 📋 Day 1 Completion Status

### ✅ Requirements Completed

**1. Understand Requirements**
- [x] Reviewed MERN stack requirements
- [x] Understood role-based access control
- [x] Identified backend architecture (MVC with Services)
- [x] Identified frontend architecture (React + Redux Toolkit)

**2. Plan Folder Structure**
- [x] Backend folder structure created with proper separation of concerns
- [x] Frontend folder structure initialized with Vite and Tailwind
- [x] Configuration files properly organized

**3. Set up Backend**
- [x] Express.js app initialized
- [x] All required dependencies installed
- [x] Server entry point created
- [x] Environment variables configured

**4. Set up Frontend**
- [x] React + Vite configured
- [x] Redux Toolkit integrated
- [x] Tailwind CSS setup
- [x] All frontend dependencies installed

**5. Set up MongoDB**
- [x] MongoDB connection configuration created
- [x] User model with password hashing and role support
- [x] Ticket model with all required fields
- [x] Connection string format documented

**6. Create Git Repository**
- [x] Repository initialized and connected to GitHub
- [x] Professional commits with conventional naming
- [x] `.gitignore` properly configured
- [x] Code organized in logical modules

### 📊 Project Stats

**Backend:**
- 7+ main dependencies installed
- Auth service, controller, routes ready
- Middleware for auth, role-based access, and error handling
- Database models designed and implemented

**Frontend:**
- 9+ main dependencies installed
- Build tool (Vite) configured
- Styling framework (Tailwind) setup
- Redux structure ready for state management

**Git Repository:**
- 4 professional commits
- Clean commit history
- Proper gitignore configuration

## 🎯 Next Steps - Day 2 Focus

### Database Setup
1. Create MongoDB Atlas account (if not done)
2. Create a cluster
3. Generate connection string
4. Update `backend/.env` with connection string

### Testing Authentication
1. Start backend server: `npm run dev` (in backend directory)
2. Test `/api/auth/register` endpoint
3. Test `/api/auth/login` endpoint
4. Verify JWT token generation

### Frontend Authentication Pages
1. Create login page component
2. Create register page component
3. Integrate with Redux for state management
4. Add protected route wrapper

### Protected Routes
1. Test auth middleware on backend
2. Create protected route component on frontend
3. Verify unauthorized access is blocked

## 📚 Architecture Notes

### Backend Pattern (MVC + Services)
- **Routes**: Define API endpoints
- **Controllers**: Handle requests/responses
- **Services**: Contain business logic
- **Models**: MongoDB schemas
- **Middleware**: Auth, validation, error handling
- **Utils**: Reusable helpers

### Frontend State Management
- Redux Toolkit for auth, tickets, users, dashboard
- Axios for API calls
- React Router for navigation
- Protected routes based on user role

## 🔒 Security Features Implemented

- Password hashing with bcrypt
- JWT token generation and validation
- Role-based access control middleware
- Protected API routes
- CORS configuration
- Environment variables for sensitive data

---

**Status**: Day 1 Complete ✅
**Last Updated**: June 4, 2026
**Next Milestone**: Day 2 - Complete Authentication Testing

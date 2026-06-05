import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';

// Layout
import MainLayout from './components/layout/MainLayout';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import EditTicket    from './pages/EditTicket';

// Placeholder pages — built on Day 6
const UserManagement = () => <div className="page-placeholder"><h2>User Management</h2><p>Coming Day 6</p></div>;
const NotFound       = () => <div className="page-placeholder"><h2>404 — Page not found</h2></div>;

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // On mount — if a token exists in localStorage, fetch current user to
  // restore the session without requiring a re-login after page refresh
  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ─────────────────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (requires valid JWT) ─────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* Dashboard — all roles */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Tickets — all roles (content filtered server-side) */}
            <Route path="/tickets"        element={<TicketList />} />
            <Route path="/tickets/new"    element={<CreateTicket />} />
            <Route path="/tickets/:id"    element={<TicketDetails />} />
            <Route path="/tickets/:id/edit" element={<EditTicket />} />

            {/* Admin-only routes */}
            <Route element={<RoleRoute allowedRoles={['Admin']} />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>

          </Route>
        </Route>

        {/* ── Default redirects ──────────────────────────────────── */}
        <Route path="/"   element={<Navigate to="/dashboard" replace />} />
        <Route path="*"   element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

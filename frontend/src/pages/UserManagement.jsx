import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUserRole, updateUserStatus, createUser, deleteUser } from '../features/users/userSlice';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, pagination, isLoading, error } = useSelector((state) => state.users);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Create User Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [validationError, setValidationError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const roles = ['Admin', 'Agent', 'User'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      ...(search && { search }),
      ...(role && { role }),
      ...(status && { status }),
    };
    dispatch(fetchUsers(params));
  }, [dispatch, page, role, status]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Form validations
    if (!newUserData.name.trim()) {
      setValidationError('Name is required');
      return;
    }
    if (!newUserData.email.trim()) {
      setValidationError('Email is required');
      return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newUserData.email.trim())) {
      setValidationError('Please provide a valid email address');
      return;
    }
    if (newUserData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setCreateLoading(true);
    dispatch(createUser(newUserData))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        setNewUserData({ name: '', email: '', password: '', role: 'User' });
        // Reload list to include new user
        dispatch(fetchUsers({ page: 1, limit: 10 }));
        setPage(1);
      })
      .catch((err) => {
        setValidationError(err || 'Failed to create user');
      })
      .finally(() => {
        setCreateLoading(false);
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(
      fetchUsers({
        page: 1,
        limit: 10,
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      })
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setRole('');
    setStatus('');
    setPage(1);
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  };

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      dispatch(updateUserRole({ id: userId, role: newRole }))
        .unwrap()
        .then(() => {
          // If the admin changes an agent's role, we may need to reload the current page.
          dispatch(fetchUsers({ page, limit: 10, search, role, status }));
        })
        .catch(() => {});
    }
  };

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const actionText = newStatus === 'Active' ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${actionText} this user's account?`)) {
      dispatch(updateUserStatus({ id: userId, status: newStatus }))
        .unwrap()
        .then(() => {
          dispatch(fetchUsers({ page, limit: 10, search, role, status }));
        })
        .catch(() => {});
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user's account? This action cannot be undone.")) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          dispatch(fetchUsers({ page, limit: 10, search, role, status }));
        })
        .catch(() => {});
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleOpenModal = () => {
    setValidationError('');
    setNewUserData({ name: '', email: '', password: '', role: 'User' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setValidationError('');
    setNewUserData({ name: '', email: '', password: '', role: 'User' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateSubmit(e);
    }
  };

  const inputStyle = { background: 'var(--bg-raised)' };

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>User Management</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Overview of all registered users. Update roles, change statuses, and manage access.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleOpenModal}
            className="auth-btn"
            style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, marginTop: 0 }}
          >
            <span className="material-icons" style={{ fontSize: 18 }}>add</span>
            <span>Create User</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="logout-btn"
            style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span className="material-icons" style={{ fontSize: 16 }}>arrow_back</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} style={{ marginBottom: 24 }} />}

      {/* Search & Filters */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            className="field-input"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="auth-btn"
            style={{ width: 'auto', padding: '0 24px', marginTop: 0 }}
          >
            Search
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {/* Role Filter */}
            <select
              className="field-input"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              style={{ width: 150, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="field-input"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={{ width: 150, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {(search || role || status) && (
            <button
              onClick={handleClearFilters}
              className="logout-btn"
              style={{ width: 'auto', padding: '8px 16px', border: '1px dashed var(--border)' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Loader />
      ) : users.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <span
            className="material-icons"
            style={{ fontSize: 48, marginBottom: 16, display: 'block', color: 'var(--text-muted)' }}
          >
            people
          </span>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            No users found
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
            There are no registered users matching your query. Try clearing the filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 14,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-raised)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  <th style={{ padding: '16px 20px' }}>User Details</th>
                  <th style={{ padding: '16px 20px' }}>Joined Date</th>
                  <th style={{ padding: '16px 20px' }}>Role</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Actions</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;

                  // Dynamic styles for role badges
                  const roleColors = {
                    Admin: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
                    Agent: { bg: 'rgba(234,179,8,0.15)', color: '#fde047' },
                    User: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
                  };
                  const roleStyle = roleColors[u.role] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };

                  // Dynamic styles for status badges
                  const statusColors = {
                    Active: { bg: 'rgba(34,197,94,0.15)', color: '#86efac' },
                    Inactive: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
                  };
                  const statusStyle = statusColors[u.status] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };

                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-overlay)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* User Info */}
                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {u.name}
                            {isSelf && (
                              <span
                                style={{
                                  fontSize: 10,
                                  background: 'var(--border)',
                                  color: 'var(--text-secondary)',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  fontWeight: 500,
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{u.email}</div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Role Display & Selector */}
                      <td style={{ padding: '16px 20px' }}>
                        {isSelf ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              background: roleStyle.bg,
                              color: roleStyle.color,
                            }}
                          >
                            {u.role}
                          </span>
                        ) : (
                          <select
                            className="field-input"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{
                              width: 'auto',
                              padding: '4px 8px',
                              fontSize: 13,
                              background: 'var(--bg-raised)',
                              minWidth: 100,
                              borderColor: 'var(--border)',
                            }}
                          >
                            {roles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Status Display */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 600,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => handleStatusToggle(u._id, u.status)}
                          disabled={isSelf}
                          className="logout-btn"
                          style={{
                            width: 'auto',
                            padding: '6px 12px',
                            fontSize: 12,
                            opacity: isSelf ? 0.4 : 1,
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            borderColor: u.status === 'Active' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                            color: u.status === 'Active' ? '#fca5a5' : '#86efac',
                            background: 'transparent',
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: 14 }}>
                            {u.status === 'Active' ? 'block' : 'check'}
                          </span>
                          <span>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      </td>

                      {/* Delete button */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={isSelf}
                          className="logout-btn"
                          style={{
                            width: 'auto',
                            padding: '6px 10px',
                            fontSize: 12,
                            opacity: isSelf ? 0.4 : 1,
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderColor: 'rgba(239,68,68,0.3)',
                            color: '#ef4444',
                            background: 'transparent',
                            minHeight: 'auto',
                          }}
                          title="Delete User"
                        >
                          <span className="material-icons" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.pages > 1 && (
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-raised)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} total)
              </span>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="logout-btn"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="logout-btn"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 12 }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 32,
              width: '100%',
              maxWidth: 480,
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
              Create New User
            </h3>

            {validationError && (
              <ErrorMessage message={validationError} style={{ marginBottom: 16 }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="create-user-full-name">Full Name</label>
                <input
                  id="create-user-full-name"
                  type="text"
                  autoComplete="off"
                  className="field-input"
                  style={{ background: 'var(--bg-raised)' }}
                  placeholder="John Doe"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, name: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  disabled={createLoading}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="create-user-email-address">Email Address</label>
                <input
                  id="create-user-email-address"
                  type="email"
                  autoComplete="new-email"
                  className="field-input"
                  style={{ background: 'var(--bg-raised)' }}
                  placeholder="john@example.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, email: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  disabled={createLoading}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="create-user-secret-password">Password</label>
                <input
                  id="create-user-secret-password"
                  type="password"
                  autoComplete="new-password"
                  className="field-input"
                  style={{ background: 'var(--bg-raised)' }}
                  placeholder="••••••••"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, password: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  disabled={createLoading}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="create-user-role-select">Role</label>
                <select
                  id="create-user-role-select"
                  className="field-input"
                  style={{ background: 'var(--bg-raised)' }}
                  value={newUserData.role}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, role: e.target.value }))}
                  disabled={createLoading}
                >
                  <option value="User">User (Client)</option>
                  <option value="Agent">Agent (Support staff)</option>
                  <option value="Admin">Admin (Full access)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
                  className="logout-btn"
                  style={{ width: 'auto', padding: '10px 20px' }}
                  onClick={handleCloseModal}
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateSubmit}
                  className="auth-btn"
                  style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

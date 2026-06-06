import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTickets } from '../features/tickets/ticketSlice';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';

const TicketList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tickets, pagination, isLoading, error } = useSelector((state) => state.tickets);

  // Filter and Search states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const categories = [
    'Bug',
    'Feature Request',
    'Technical Issue',
    'Payment Issue',
    'Account Issue',
    'Other'
  ];
  
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  // Fetch tickets when filters/pagination changes
  useEffect(() => {
    const params = {
      page,
      limit: 10,
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category })
    };
    
    dispatch(fetchTickets(params));
  }, [dispatch, page, status, priority, category, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchTickets({
      page: 1,
      limit: 10,
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category })
    }));
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    dispatch(fetchTickets({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Support Tickets</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {user.role === 'Admin' && 'Oversee and manage all support tickets in the system.'}
            {user.role === 'Agent' && 'Manage support tickets assigned to you.'}
            {user.role === 'User' && 'Track and manage your submitted support tickets.'}
          </p>
        </div>

        {user.role !== 'Agent' && (
          <button
            onClick={() => navigate('/tickets/new')}
            className="auth-btn"
            style={{ width: 'auto', padding: '10px 20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span className="material-icons" style={{ fontSize: 18 }}>add</span>
            <span>Create Ticket</span>
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Search & Filters Panel */}
      <div 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            className="field-input"
            placeholder="Search tickets by title, description, or TKT number..."
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
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {/* Status Filter */}
            <select
              className="field-input"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              style={{ width: 140, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              className="field-input"
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              style={{ width: 140, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="">All Priorities</option>
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              className="field-input"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              style={{ width: 140, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              className="field-input"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
                setPage(1);
              }}
              style={{ width: 160, padding: '8px 12px', background: 'var(--bg-raised)' }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="status-asc">Status: A to Z</option>
              <option value="status-desc">Status: Z to A</option>
            </select>
          </div>

          {(search || status || priority || category || sortBy !== 'createdAt' || sortOrder !== 'desc') && (
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

      {/* Tickets Table / List */}
      {isLoading ? (
        <Loader />
      ) : tickets.length === 0 ? (
        <div 
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 24px',
            textAlign: 'center'
          }}
        >
          <span className="material-icons" style={{ fontSize: 48, marginBottom: 16, display: 'block', color: 'var(--text-muted)' }}>confirmation_number</span>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No tickets found</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
            There are no support tickets matching your selection. Try clearing filters or creating a new ticket.
          </p>
        </div>
      ) : (
        <div 
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table 
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 14
              }}
            >
              <thead>
                <tr 
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-raised)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  <th style={{ padding: '16px 20px' }}>ID</th>
                  <th style={{ padding: '16px 20px' }}>Title</th>
                  <th style={{ padding: '16px 20px' }}>Category</th>
                  <th style={{ padding: '16px 20px' }}>Priority</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Created</th>
                  {user.role !== 'User' && <th style={{ padding: '16px 20px' }}>Creator</th>}
                  {user.role !== 'Agent' && <th style={{ padding: '16px 20px' }}>Agent</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/tickets/${t._id}`)}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'background var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-overlay)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--accent-light)' }}>
                      {t.ticketNumber}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <div style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {t.category}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                      {formatDate(t.createdAt)}
                    </td>
                    {user.role !== 'User' && (
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                        {t.createdBy?.name || 'Unknown'}
                      </td>
                    )}
                    {user.role !== 'Agent' && (
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                        {t.assignedTo?.name ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                            {t.assignedTo.name}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
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
                justifyContent: 'space-between'
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
    </div>
  );
};

export default TicketList;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTicketById,
  updateTicketStatus,
  assignTicket,
  addComment,
  deleteTicket,
  clearTicketError
} from '../features/tickets/ticketSlice';
import { getAgentsRequest } from '../api/userApi';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';

const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { ticket, isLoading, commentLoading, error } = useSelector((state) => state.tickets);
  
  const [commentText, setCommentText] = useState('');
  const [agents, setAgents] = useState([]);
  const [assignError, setAssignError] = useState(null);

  // Fetch ticket details on mount/ID change
  useEffect(() => {
    dispatch(fetchTicketById(id));
    return () => {
      dispatch(clearTicketError());
    };
  }, [dispatch, id]);

  // Fetch agents list if current user is Admin
  useEffect(() => {
    if (user?.role === 'Admin') {
      getAgentsRequest()
        .then((data) => {
          setAgents(data);
        })
        .catch((err) => {
          setAssignError('Failed to load agents for assignment.');
        });
    }
  }, [user]);

  const handleStatusChange = (newStatus) => {
    dispatch(updateTicketStatus({ id, status: newStatus }));
  };

  const handleAssignChange = (agentId) => {
    dispatch(assignTicket({ id, agentId: agentId || null }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ id, message: commentText }))
      .unwrap()
      .then(() => setCommentText(''));
  };

  const handleDeleteTicket = () => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      dispatch(deleteTicket(id))
        .unwrap()
        .then(() => {
          navigate('/tickets');
        });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !ticket) {
    return <Loader fullScreen />;
  }

  if (error && !ticket) {
    return (
      <div className="page-content">
        <ErrorMessage message={error} />
        <button onClick={() => navigate('/tickets')} className="logout-btn" style={{ width: 'auto', marginTop: 12 }}>
          Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) return null;

  const isCreator = ticket.createdBy?._id === user._id;
  const isAssignedAgent = ticket.assignedTo?._id === user._id;

  return (
    <div className="page-content" style={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Back Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/tickets')}
          className="logout-btn"
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          ← Back to Tickets
        </button>

        {/* Delete actions (Admin or Creator when Open) */}
        {(user.role === 'Admin' || (user.role === 'User' && isCreator && ticket.status === 'Open')) && (
          <button
            onClick={handleDeleteTicket}
            style={{
              padding: '8px 16px',
              background: 'var(--danger-muted)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-muted)'}
          >
            Delete Ticket
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      {assignError && <ErrorMessage message={assignError} />}

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        
        {/* Left Side: Ticket Metadata & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Main Info Card */}
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase' }}>
                {ticket.ticketNumber}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ticket.category}</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              {ticket.title}
            </h2>

            <hr style={{ border: 'none', height: 1, background: 'var(--border)', margin: '16px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Description</h3>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
              Discussion ({ticket.comments?.length || 0})
            </h3>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {ticket.comments?.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                  No comments yet. Start the conversation below.
                </p>
              ) : (
                ticket.comments.map((comment) => {
                  const commentUser = comment.user || {};
                  const isCommentCreator = commentUser._id === ticket.createdBy?._id;
                  const isCommentAgent = commentUser._id === ticket.assignedTo?._id;
                  
                  return (
                    <div 
                      key={comment._id}
                      style={{
                        padding: 16,
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                            {commentUser.name || 'Unknown User'}
                          </span>
                          <span 
                            className={`role-badge ${
                              commentUser.role === 'Admin' 
                                ? 'role-badge--admin' 
                                : commentUser.role === 'Agent' 
                                ? 'role-badge--agent' 
                                : 'role-badge--user'
                            }`}
                            style={{ fontSize: 9, padding: '1px 5px' }}
                          >
                            {commentUser.role || 'User'}
                          </span>
                          
                          {/* Relationship tags */}
                          {isCommentCreator && (
                            <span style={{ fontSize: 10, color: 'var(--accent-light)', background: 'var(--accent-muted)', padding: '1px 6px', borderRadius: 4, fontWeight: 500 }}>
                              Author
                            </span>
                          )}
                          {isCommentAgent && (
                            <span style={{ fontSize: 10, color: '#34d399', background: 'rgba(52, 211, 153, 0.12)', padding: '1px 6px', borderRadius: 4, fontWeight: 500 }}>
                              Assigned Agent
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                        {comment.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                className="field-input"
                placeholder="Write a message or update..."
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentLoading}
                style={{ resize: 'none', minHeight: 80, fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="auth-btn"
                  style={{ width: 'auto', padding: '8px 20px', marginTop: 0 }}
                  disabled={commentLoading || !commentText.trim()}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Right Side: Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Status & Priority Card */}
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Ticket Status
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Current Status</span>
                <StatusBadge status={ticket.status} />
              </div>

              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Priority Level</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            {/* Status Transition Actions */}
            <hr style={{ border: 'none', height: 1, background: 'var(--border)', margin: '20px 0' }} />
            
            <h5 style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 10 }}>Update Status</h5>
            
            {/* Admin status updates */}
            {user.role === 'Admin' && (
              <select
                className="field-input"
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-raised)' }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            )}

            {/* Agent status updates (only for assigned agent) */}
            {user.role === 'Agent' && (
              isAssignedAgent ? (
                <select
                  className="field-input"
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-raised)' }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Only assigned agents can update status.
                </p>
              )
            )}

            {/* User status updates (only close own ticket) */}
            {user.role === 'User' && (
              isCreator && ticket.status !== 'Closed' ? (
                <button
                  onClick={() => handleStatusChange('Closed')}
                  className="logout-btn"
                  style={{ width: '100%', padding: '8px 12px' }}
                >
                  Close Ticket
                </button>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {ticket.status === 'Closed' ? 'Ticket is closed.' : 'You can close this ticket once resolved.'}
                </p>
              )
            )}

          </div>

          {/* Assignment Control Card */}
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Assigned Agent
            </h4>

            {user.role === 'Admin' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <select
                  className="field-input"
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleAssignChange(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-raised)' }}
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Assigning an agent automatically transitions an Open ticket to In Progress.
                </p>
              </div>
            ) : (
              <div>
                {ticket.assignedTo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="navbar-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {ticket.assignedTo.name?.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                        {ticket.assignedTo.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {ticket.assignedTo.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Not assigned yet
                  </span>
                )}
              </div>
            )}

            <hr style={{ border: 'none', height: 1, background: 'var(--border)', margin: '20px 0' }} />

            {/* Created By details */}
            <h4 style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              Submitted By
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="navbar-avatar" style={{ width: 28, height: 28, fontSize: 11, background: 'linear-gradient(135deg, var(--accent-light), #c084fc)' }}>
                {ticket.createdBy?.name?.charAt(0)}
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  {ticket.createdBy?.name || 'Unknown'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {ticket.createdBy?.email || 'N/A'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)' }}>
              Created: {formatDate(ticket.createdAt)}
            </div>
          </div>

          {/* Timeline History */}
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Activity History
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
              {ticket.statusHistory?.map((hist, i) => (
                <div key={hist._id || i} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  {/* Visual bullet connection */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 4 }} />
                    {i < ticket.statusHistory.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--border)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      Status → <StatusBadge status={hist.status} />
                    </span>
                    <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>
                      By {hist.changedBy?.name || 'System'}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                      {formatDate(hist.changedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TicketDetails;

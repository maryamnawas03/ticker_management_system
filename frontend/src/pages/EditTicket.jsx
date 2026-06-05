import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTicketById, updateTicket } from '../features/tickets/ticketSlice';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';

const CATEGORIES = ['Bug', 'Feature Request', 'Technical Issue', 'Payment Issue', 'Account Issue', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const EditTicket = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticket, isLoading, error } = useSelector((state) => state.tickets);

  const [formData, setFormData] = useState({
    title:       '',
    description: '',
    category:    'Bug',
    priority:    'Medium',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Load the ticket on mount
  useEffect(() => {
    dispatch(fetchTicketById(id));
  }, [dispatch, id]);

  // Pre-fill form once the ticket is loaded
  useEffect(() => {
    if (ticket && ticket._id === id) {
      setFormData({
        title:       ticket.title       || '',
        description: ticket.description || '',
        category:    ticket.category    || 'Bug',
        priority:    ticket.priority    || 'Medium',
      });
    }
  }, [ticket, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim())       errors.title       = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    dispatch(updateTicket({
      id,
      ticketData: {
        title:       formData.title,
        description: formData.description,
        category:    formData.category,
        priority:    formData.priority,
      },
    }))
      .unwrap()
      .then(() => navigate('/tickets'))
      .catch(() => setSaving(false));
  };

  /* ── Loading skeleton while ticket fetches ─────────────────────────── */
  if (isLoading && !ticket) return <Loader fullScreen />;

  if (!ticket && !isLoading) {
    return (
      <div className="page-content">
        <ErrorMessage message="Ticket not found." />
        <button onClick={() => navigate('/tickets')} className="logout-btn"
          style={{ width: 'auto', marginTop: 12 }}>
          ← Back to Tickets
        </button>
      </div>
    );
  }

  const inputStyle = { background: 'var(--bg-raised)' };
  const busy = saving || isLoading;

  return (
    <div className="page-content" style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {ticket?.ticketNumber}
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Ticket</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Make your changes below and click <strong>Save Changes</strong> to update.
          </p>
        </div>
        <button onClick={() => navigate(`/tickets/${id}`)} className="logout-btn"
          style={{ width: 'auto', padding: '8px 16px' }}>
          ← Back to Ticket
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSave}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Title */}
        <div className="field-group">
          <label className="field-label" htmlFor="title">Ticket Title</label>
          <input id="title" name="title" type="text"
            className={`field-input ${fieldErrors.title ? 'field-input--error' : ''}`}
            style={inputStyle}
            value={formData.title}
            onChange={handleChange}
            disabled={busy}
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </div>

        {/* Category + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="category">Category</label>
            <select id="category" name="category" className="field-input" style={inputStyle}
              value={formData.category} onChange={handleChange} disabled={busy}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="priority">Priority</label>
            <select id="priority" name="priority" className="field-input" style={inputStyle}
              value={formData.priority} onChange={handleChange} disabled={busy}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="field-group">
          <label className="field-label" htmlFor="description">Detailed Description</label>
          <textarea id="description" name="description" rows="7"
            className={`field-input ${fieldErrors.description ? 'field-input--error' : ''}`}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 140, fontFamily: 'inherit', lineHeight: 1.6 }}
            value={formData.description}
            onChange={handleChange}
            disabled={busy}
          />
          {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" className="logout-btn"
            style={{ width: 'auto', padding: '10px 20px' }}
            onClick={() => navigate(`/tickets/${id}`)} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="auth-btn"
            style={{ width: 'auto', padding: '10px 28px', marginTop: 0 }}
            disabled={busy}>
            {busy ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicket;

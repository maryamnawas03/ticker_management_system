import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../features/tickets/ticketSlice';
import ErrorMessage from '../components/common/ErrorMessage';

const CATEGORIES = ['Bug', 'Feature Request', 'Technical Issue', 'Payment Issue', 'Account Issue', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.tickets);

  const [formData, setFormData] = useState({
    title:       '',
    description: '',
    category:    'Bug',
    priority:    'Medium',
  });

  const [fieldErrors, setFieldErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(createTicket({
      title:       formData.title,
      description: formData.description,
      category:    formData.category,
      priority:    formData.priority,
    }))
      .unwrap()
      .then(() => navigate('/tickets'))
      .catch(() => {});
  };

  const inputStyle = { background: 'var(--bg-raised)' };

  return (
    <div className="page-content" style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Create New Ticket</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Submit a support ticket and our team will assist you.
          </p>
        </div>
        <button onClick={() => navigate('/tickets')} className="logout-btn"
          style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-icons" style={{ fontSize: 16 }}>arrow_back</span>
          <span>Back to List</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit}
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
            placeholder="Brief summary of the issue…"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </div>

        {/* Category + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="category">Category</label>
            <select id="category" name="category" className="field-input" style={inputStyle}
              value={formData.category} onChange={handleChange} disabled={isLoading}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="priority">Priority</label>
            <select id="priority" name="priority" className="field-input" style={inputStyle}
              value={formData.priority} onChange={handleChange} disabled={isLoading}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="field-group">
          <label className="field-label" htmlFor="description">Detailed Description</label>
          <textarea id="description" name="description" rows="6"
            className={`field-input ${fieldErrors.description ? 'field-input--error' : ''}`}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 130, fontFamily: 'inherit', lineHeight: 1.6 }}
            placeholder="Describe the problem in detail…"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
          />
          {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" className="logout-btn"
            style={{ width: 'auto', padding: '10px 20px' }}
            onClick={() => navigate('/tickets')} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="auth-btn"
            style={{ width: 'auto', padding: '10px 28px', marginTop: 0 }}
            disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;

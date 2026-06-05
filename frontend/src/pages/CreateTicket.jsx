import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../features/tickets/ticketSlice';
import ErrorMessage from '../components/common/ErrorMessage';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector((state) => state.tickets);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Bug',
    priority: 'Medium',
  });
  
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    'Bug',
    'Feature Request',
    'Technical Issue',
    'Payment Issue',
    'Account Issue',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(createTicket(formData))
      .unwrap()
      .then(() => {
        navigate('/tickets');
      })
      .catch(() => {});
  };

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Create New Ticket</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Submit a support ticket and our team will assist you.</p>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="logout-btn"
          style={{ width: 'auto', padding: '8px 16px', cursor: 'pointer' }}
        >
          Back to List
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <form 
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div className="field-group">
          <label className="field-label" htmlFor="title">Ticket Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className={`field-input ${formErrors.title ? 'field-input--error' : ''}`}
            placeholder="Brief summary of the issue (e.g. Cannot complete checkout)"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
          {formErrors.title && <span className="field-error">{formErrors.title}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="field-input"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
              style={{ appearance: 'none', background: 'var(--bg-raised)' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className="field-input"
              value={formData.priority}
              onChange={handleChange}
              disabled={isLoading}
              style={{ appearance: 'none', background: 'var(--bg-raised)' }}
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            rows="6"
            className={`field-input ${formErrors.description ? 'field-input--error' : ''}`}
            placeholder="Please explain the problem in detail. Include steps to reproduce, error messages, and what you expected to happen."
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            style={{ resize: 'vertical', minHeight: 120, fontFamily: 'inherit', lineHeight: '1.5' }}
          />
          {formErrors.description && <span className="field-error">{formErrors.description}</span>}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            type="button"
            className="logout-btn"
            style={{ width: 'auto', padding: '10px 20px', border: '1px solid var(--border)' }}
            onClick={() => navigate('/tickets')}
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="auth-btn"
            style={{ 
              width: 'auto', 
              padding: '10px 24px', 
              marginTop: 0, 
              background: 'var(--accent)', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;

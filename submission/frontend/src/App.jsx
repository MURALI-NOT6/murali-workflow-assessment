import { useState } from 'react';
import IncidentService from './api/incidentService';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    incidentId: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
    title: 'Database CPU at 99%',
    description: 'The primary database cluster db-prod-01 is experiencing exceptionally high CPU utilization, causing slow queries across the main application dashboard and delayed background worker jobs.',
    severity: 'P1',
    ownerEmail: 'oncall-dba@example.com',
    tags: 'database, urgent'
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      createdAt: new Date().toISOString()
    };

    try {
      await IncidentService.triggerIncident(payload);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);

      // Refresh ID
      setFormData(prev => ({
        ...prev,
        incidentId: `INC-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    } catch (err) {
      console.error(err);
      setStatus('error');
      // Axios stores response data in err.response.data
      const message = err.response?.data?.message || err.message || 'Network error occurred';
      setErrorMessage(message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel main-card">
        <div className="header">
          <div className="pulse-indicator"></div>
          <h1>Incident Trigger</h1>
        </div>
        <p className="subtitle">Dispatch new events directly to your n8n workflow.</p>

        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-group row">
            <div className="col">
              <label>Incident ID</label>
              <input name="incidentId" value={formData.incidentId} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Severity</label>
              <select name="severity" value={formData.severity} onChange={handleChange}>
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Owner Email</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Tags (Comma Separated)</label>
              <input name="tags" value={formData.tags} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={status === 'loading'} className={`submit-btn ${status}`}>
            {status === 'loading' ? 'Dispatching...' : status === 'success' ? 'Sent Successfully!' : status === 'error' ? 'Failed' : 'Trigger Incident'}
          </button>

          {status === 'error' && (
            <div className="error-message">
              Error: {errorMessage}. (Check if n8n is listening and CORS is allowed)
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

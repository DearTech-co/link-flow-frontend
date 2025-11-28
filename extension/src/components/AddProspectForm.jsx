import React, { useEffect, useState } from 'react';
import { LINKEDIN_PROFILE_PATTERN } from '../utils/constants.js';

function AddProspectForm({ initialValues, onSubmit, loading }) {
  const [form, setForm] = useState(initialValues);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!LINKEDIN_PROFILE_PATTERN.test(form.linkedinUrl || '')) {
      setValidationError('Please provide a valid LinkedIn profile URL.');
      return;
    }
    setValidationError('');
    onSubmit(form);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        LinkedIn URL
        <input
          type="url"
          value={form.linkedinUrl}
          onChange={(e) => updateField('linkedinUrl', e.target.value)}
          placeholder="https://www.linkedin.com/in/username/"
          required
        />
      </label>
      <div className="row">
        <label>
          First name
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Ada"
          />
        </label>
        <label>
          Last name
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Lovelace"
          />
        </label>
      </div>
      <label>
        Job title
        <input
          type="text"
          value={form.jobTitle}
          onChange={(e) => updateField('jobTitle', e.target.value)}
          placeholder="Senior Engineer"
        />
      </label>
      <label>
        Company
        <input
          type="text"
          value={form.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder="LinkFlow"
        />
      </label>
      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Add notes..."
        />
      </label>

      {validationError && <div className="error">{validationError}</div>}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save prospect'}
      </button>
    </form>
  );
}

export default AddProspectForm;

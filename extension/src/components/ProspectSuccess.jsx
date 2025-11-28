import React from 'react';

function ProspectSuccess({ prospect, onAddAnother }) {
  return (
    <div className="success">
      <p style={{ margin: 0, fontWeight: 700 }}>Prospect saved</p>
      {prospect?.linkedinUrl && (
        <p style={{ margin: '6px 0' }}>
          <a className="link" href={prospect.linkedinUrl} target="_blank" rel="noreferrer">
            View LinkedIn profile
          </a>
        </p>
      )}
      <button className="btn btn-secondary" onClick={onAddAnother}>
        Add another
      </button>
    </div>
  );
}

export default ProspectSuccess;

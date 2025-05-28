import React, { useState } from 'react';

const DomainAgeChecker = () => {
  const [domain, setDomain] = useState('');
  const [age, setAge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkDomainAge = async (domain) => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockResponse = {
        domain: domain,
        creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2), // 2 years ago
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
        expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year from now
        registrar: 'Example Registrar, Inc.'
      };
      
      setAge({
        years: 2,
        months: 0,
        days: 0,
        ...mockResponse
      });
    } catch (err) {
      setError('Failed to fetch domain information. Please try again.');
      console.error('Domain check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }
    checkDomainAge(domain);
  };

  return (
    <div className="domain-age-checker">
      <style jsx>{`
        .domain-age-checker {
          margin: 1rem 0;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          max-width: 600px;
          background-color: white;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        input {
          padding: 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 0.375rem;
          flex-grow: 1;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }
        button {
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #3182ce;
        }
        button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
        .result {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 0.375rem;
          background-color: #f7fafc;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .result-item:last-child {
          border-bottom: none;
        }
        .result-label {
          font-weight: 500;
          color: #4a5568;
        }
        .result-value {
          font-weight: 600;
          color: #2d3748;
        }
        .loading {
          text-align: center;
          padding: 1rem;
          color: #4a5568;
        }
        .error {
          color: #e53e3e;
          margin-top: 0.5rem;
        }
      `}</style>

      <h2>Domain Age Checker</h2>
      <p>Check the age and registration details of any domain name.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !domain.trim()}>
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>

      {loading && (
        <div className="loading">
          <p>Fetching domain information...</p>
        </div>
      )}

      {age && !loading && (
        <div className="result">
          <h3>Domain Information</h3>
          <div className="result-item">
            <span className="result-label">Domain:</span>
            <span className="result-value">{age.domain}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Age:</span>
            <span className="result-value">
              {age.years} {age.years === 1 ? 'year' : 'years'}, {age.months} {age.months === 1 ? 'month' : 'months'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Created:</span>
            <span className="result-value">
              {age.creationDate.toLocaleDateString()}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Last Updated:</span>
            <span className="result-value">
              {age.lastUpdated.toLocaleDateString()}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Expires:</span>
            <span className="result-value">
              {age.expiresDate.toLocaleDateString()}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Registrar:</span>
            <span className="result-value">{age.registrar}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainAgeChecker;

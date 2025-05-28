import React, { useState } from 'react';

const DomainBlacklistChecker = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkDomain = async (domain) => {
    try {
      setLoading(true);
      setError('');
      
      // Call the Netlify function
      const response = await fetch(`/.netlify/functions/checkBlacklist?domain=${encodeURIComponent(domain)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update results with the API response
      setResults({
        domain: data.domain,
        isListed: data.isListed,
        blacklists: data.blacklists,
        lastChecked: data.lastChecked,
        reputationScore: data.reputationScore
      });
    } catch (err) {
      setError('Failed to check domain against blacklists. Please try again.');
      console.error('Blacklist check error:', err);
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
    checkDomain(domain);
  };

  return (
    <div className="domain-blacklist-checker">
      <style jsx>{`
        .domain-blacklist-checker {
          margin: 1rem 0;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          max-width: 800px;
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
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-clean {
          background-color: #c6f6d5;
          color: #22543d;
        }
        .status-listed {
          background-color: #fed7d7;
          color: #822727;
        }
        .blacklist-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
        }
        .blacklist-item:last-child {
          border-bottom: none;
        }
        .blacklist-name {
          font-weight: 500;
          color: #2d3748;
        }
        .loading {
          text-align: center;
          padding: 1rem;
          color: #4a5568;
        }
        .error {
          color: #e53e3e;
          margin: 0.5rem 0;
          padding: 0.5rem;
          background-color: #fff5f5;
          border-radius: 0.25rem;
          border-left: 3px solid #e53e3e;
        }
        .reputation-score {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0;
          text-align: center;
        }
        .score-good {
          color: #38a169;
        }
        .score-medium {
          color: #d69e2e;
        }
        .score-poor {
          color: #e53e3e;
        }
      `}</style>

      <h2>Domain Blacklist Checker</h2>
      <p>Check if a domain is listed in major email blacklists.</p>
      
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
          <p>Checking domain against blacklists...</p>
        </div>
      )}

      {results && !loading && (
        <div className="result">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>{results.domain}</h3>
            <span className={`status-badge ${results.isListed ? 'status-listed' : 'status-clean'}`}>
              {results.isListed ? 'Listed' : 'Clean'}
            </span>
          </div>
          
          <div className={`reputation-score ${
            results.reputationScore > 75 ? 'score-good' : 
            results.reputationScore > 50 ? 'score-medium' : 'score-poor'
          }`}>
            Reputation Score: {results.reputationScore}/100
          </div>
          
          <div style={{ margin: '1rem 0' }}>
            <strong>Blacklist Status:</strong>
            {results.blacklists.map((list, index) => (
              <div key={index} className="blacklist-item">
                <span className="blacklist-name">{list.name}</span>
                <span className={`status-badge ${list.listed ? 'status-listed' : 'status-clean'}`}>
                  {list.listed ? 'Listed' : 'Clean'}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '1rem' }}>
            Last checked: {new Date(results.lastChecked).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainBlacklistChecker;

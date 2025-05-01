import React, { useState } from '/snippets/react';

/**
 * DnsValidator Component
 * Description: A React component for validating DNS records. Allows users to input a DNS record, validate it, and view the results in a clean and accessible layout.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["DNS Validator", "React Component", "SEO", "Accessibility"]
 */

export const DnsValidator = () => {
  const [record, setRecord] = useState('');
  const [result, setResult] = useState(null);

  const validateRecord = async () => {
    try {
      const response = await fetch('/api/validate-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record }),
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ valid: false, error: 'Validation failed' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4" aria-label="DNS Record Validator">
        DNS Record Validator
      </h3>
      <div className="space-y-4">
        <textarea
          value={record}
          onChange={(e) => setRecord(e.target.value)}
          className="w-full p-3 border rounded"
          placeholder="Enter DNS record here"
          rows="3"
          aria-label="DNS Record Input"
        />
        <button
          onClick={validateRecord}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Validate DNS Record"
        >
          Validate Record
        </button>
        {result && (
          <div
            className={`p-3 rounded ${
              result.valid ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-label={`Validation Result: ${
              result.valid ? 'Valid Record' : 'Invalid Record'
            }`}
          >
            {result.valid ? '✓ Valid Record' : `✗ Error: ${result.error}`}
          </div>
        )}
      </div>
    </div>
  );
};

// Example Usage
// <DnsValidator />
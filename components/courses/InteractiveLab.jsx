import React, { useState } from 'react';

/**
 * InteractiveLab Component
 * Description: A React component for validating DNS records, specifically SPF records. Provides real-time feedback on the validity of the input and displays warnings if applicable.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Interactive Lab", "DNS Validator", "React Component", "SPF Validation", "SEO"]
 */

export const InteractiveLab = () => {
  const [recordInput, setRecordInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const validateSPF = (record) => {
    // Implementation for SPF validation logic
    const isValid = record.startsWith('v=spf1');
    const warnings = [];

    if (!isValid) {
      warnings.push('The record does not start with "v=spf1".');
    }

    return {
      valid: isValid,
      warnings,
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">DNS Record Validator</h3>
      <textarea
        value={recordInput}
        onChange={(e) => setRecordInput(e.target.value)}
        className="w-full p-3 border rounded mb-4 font-mono text-sm"
        placeholder="Paste your DNS record here..."
        rows="4"
        aria-label="DNS Record Input"
      />
      <button
        onClick={() => setValidationResult(validateSPF(recordInput))}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        aria-label="Validate DNS Record"
      >
        Validate Record
      </button>

      {validationResult && (
        <div
          className={`mt-4 p-4 rounded ${
            validationResult.valid ? 'bg-green-50' : 'bg-red-50'
          }`}
          aria-live="polite"
        >
          <h4 className="font-bold mb-2">
            {validationResult.valid ? '✓ Valid Record' : '⚠ Invalid Record'}
          </h4>
          {validationResult.warnings.length > 0 && (
            <ul className="list-disc pl-5 text-yellow-700">
              {validationResult.warnings.map((warning, i) => (
                <li key={i} className="text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// Example Usage
// <InteractiveLab />
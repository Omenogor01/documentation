import React, { useState } from 'react';

/**
 * EmailHeaderAnalyzer Component
 * Description: A React component that allows users to analyze email headers for SPF, DKIM, and DMARC authentication results.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Email Header Analyzer", "React Component", "SPF", "DKIM", "DMARC", "Email Security"]
 */

export const EmailHeaderAnalyzer = () => {
  const [headers, setHeaders] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeHeaders = () => {
    // Logic to parse and analyze email headers
    const results = {
      spf: headers.includes('spf=pass'),
      dkim: headers.match(/dkim=pass/i) ? true : false,
      dmarc: headers.includes('dmarc=pass'),
    };
    setAnalysis(results);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
      <h3 className="text-lg font-bold mb-4">Email Header Inspector</h3>
      <textarea
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        className="w-full p-3 border rounded mb-4 font-mono text-sm"
        placeholder="Paste email headers here..."
        rows="8"
        aria-label="Email Headers Input" />
      <button
        onClick={analyzeHeaders}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        aria-label="Analyze Email Headers"
      >
        Analyze Headers
      </button>

      {analysis && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div
            className={`p-4 rounded ${
              analysis.spf ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-label={`SPF Result: ${analysis.spf ? 'Pass' : 'Fail'}`}
          >
            SPF: {analysis.spf ? '✓ Pass' : '✗ Fail'}
          </div>
          <div
            className={`p-4 rounded ${
              analysis.dkim ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-label={`DKIM Result: ${analysis.dkim ? 'Pass' : 'Fail'}`}
          >
            DKIM: {analysis.dkim ? '✓ Pass' : '✗ Fail'}
          </div>
          <div
            className={`p-4 rounded ${
              analysis.dmarc ? 'bg-green-100' : 'bg-red-100'
            }`}
            aria-label={`DMARC Result: ${analysis.dmarc ? 'Pass' : 'Fail'}`}
          >
            DMARC: {analysis.dmarc ? '✓ Pass' : '✗ Fail'}
          </div>
        </div>
      )}
    </div>
  );
};

// Example Usage
// <EmailHeaderAnalyzer>
// </EmailHeaderAnalyzer>




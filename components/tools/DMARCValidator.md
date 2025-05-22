---
title: "DMARC Record Validator"
description: "Validate DMARC records for your domain"
---

# DMARC Record Validator

This tool helps you verify DMARC (Domain-based Message Authentication, Reporting & Conformance) records for your domain. DMARC is essential for email authentication and preventing email spoofing.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert } from '/snippets/components/ui';

/**
 * DMARCValidator Component
 * Description: A tool to validate DMARC records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Email", "Security"]
 */

export const DMARCValidator = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateDMARC = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dmarcvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate DMARC record');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">DMARC Record Validator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Domain</label>
          <Input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full"
          />
        </div>

        <Button
          onClick={validateDMARC}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate DMARC'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Validation Results:</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">DMARC Record:</h5>
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                  {results.dmarcRecord}
                </pre>
              </div>
              <div>
                <h5 className="font-medium">Validation Status:</h5>
                <p className={`font-medium ${results.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {results.isValid ? 'Valid' : 'Invalid'}
                </p>
              </div>
              <div>
                <h5 className="font-medium">DMARC Settings:</h5>
                <div className="space-y-2">
                  {Object.entries(results.settings).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium">Issues Found:</h5>
                <ul className="list-disc list-inside">
                  {results.issues.map((issue, index) => (
                    <li key={index} className="text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

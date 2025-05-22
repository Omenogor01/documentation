---
title: "SPF Record Validator"
description: "Validate SPF records for your domain"
---

# SPF Record Validator

This tool helps you verify SPF (Sender Policy Framework) records for your domain. SPF records are crucial for email authentication and preventing email spoofing.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert } from '/snippets/components/ui';

/**
 * SPFValidator Component
 * Description: A tool to validate SPF records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Email", "Security"]
 */

export const SPFValidator = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateSPF = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/spfvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate SPF record');
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
      <h3 className="text-xl font-bold mb-4">SPF Record Validator</h3>
      
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
          onClick={validateSPF}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate SPF'}
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
                <h5 className="font-medium">SPF Record:</h5>
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                  {results.spfRecord}
                </pre>
              </div>
              <div>
                <h5 className="font-medium">Validation Status:</h5>
                <p className={`font-medium ${results.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {results.isValid ? 'Valid' : 'Invalid'}
                </p>
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

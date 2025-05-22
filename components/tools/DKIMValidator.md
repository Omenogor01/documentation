---
title: "DKIM Record Validator"
description: "Validate DKIM records for your domain"
---

# DKIM Record Validator

This tool helps you verify DKIM (DomainKeys Identified Mail) records for your domain. DKIM is essential for email authentication and preventing email spoofing.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert } from '/snippets/components/ui';

/**
 * DKIMValidator Component
 * Description: A tool to validate DKIM records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Email", "Security"]
 */

export const DKIMValidator = () => {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('default');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateDKIM = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dkimvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, selector }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate DKIM record');
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
      <h3 className="text-xl font-bold mb-4">DKIM Record Validator</h3>
      
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

        <div>
          <label className="block text-sm font-medium mb-1">Selector</label>
          <Input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="default"
            className="w-full"
          />
        </div>

        <Button
          onClick={validateDKIM}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate DKIM'}
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
                <h5 className="font-medium">DKIM Record:</h5>
                <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                  {results.dkimRecord}
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

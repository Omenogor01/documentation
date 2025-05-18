---
title: "DNS Record Checker"
description: "Check DNS records (A, AAAA, MX, TXT, CNAME) for any domain"
---

# DNS Record Checker

This tool helps you verify DNS records for any domain. It's particularly useful for checking email-related records like MX, SPF, DKIM, and DMARC.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert } from '/snippets/components/ui';

/**
 * DNSRecordChecker Component
 * Description: A tool to check various DNS records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Email", "Tools"]
 */

export const DNSRecordChecker = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const recordTypes = [
    { value: 'A', label: 'A Record' },
    { value: 'AAAA', label: 'AAAA Record' },
    { value: 'MX', label: 'MX Record' },
    { value: 'TXT', label: 'TXT Record' },
    { value: 'CNAME', label: 'CNAME Record' },
    { value: 'NS', label: 'NS Record' },
  ];

  const handleCheck = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/.netlify/functions/dnslookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, recordType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check DNS records');
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
      <h3 className="text-xl font-bold mb-4">DNS Record Checker</h3>
      
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
          <label className="block text-sm font-medium mb-1">Record Type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {recordTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleCheck}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Records'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Results:</h4>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

---
title: "DNS Record History Checker"
description: "Check historical DNS records for your domain"
---

# DNS Record History Checker

This tool helps you view historical DNS records for your domain. It's particularly useful for tracking changes over time and debugging DNS issues.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * DNSRecordHistory Component
 * Description: A tool to check historical DNS records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "History", "Tools"]
 */

export const DNSRecordHistory = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS'];

  const checkHistory = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dnshistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, recordType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check DNS history');
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
      <h3 className="text-xl font-bold mb-4">DNS Record History Checker</h3>
      
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
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <Button
          onClick={checkHistory}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check History'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">History Results:</h4>
            <Table>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Record Value</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Changes</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {results.history.map((entry) => (
                  <Table.Row key={entry.date}>
                    <Table.Cell>
                      {new Date(entry.date).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                        {entry.value}
                      </pre>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`font-medium ${entry.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {entry.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {entry.changes.map((change) => (
                        <span key={change} className="block text-sm">
                          {change}
                        </span>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
};

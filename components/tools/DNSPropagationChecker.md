---
title: "DNS Propagation Checker"
description: "Check DNS record propagation across multiple DNS servers"
---

# DNS Propagation Checker

This tool helps you verify DNS record propagation across multiple DNS servers. It's particularly useful after making DNS changes to ensure they've been properly propagated worldwide.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * DNSPropagationChecker Component
 * Description: A tool to check DNS record propagation across multiple DNS servers
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Propagation", "Tools"]
 */

export const DNSPropagationChecker = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS'];

  const checkPropagation = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dnspropagation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, recordType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check DNS propagation');
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
      <h3 className="text-xl font-bold mb-4">DNS Propagation Checker</h3>
      
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
          onClick={checkPropagation}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Propagation'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Propagation Results:</h4>
            <Table>
              <Table.Head>
                <Table.HeadCell>DNS Server</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Record Value</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {results.servers.map((server) => (
                  <Table.Row key={server.name}>
                    <Table.Cell>{server.name}</Table.Cell>
                    <Table.Cell>{server.location}</Table.Cell>
                    <Table.Cell>
                      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                        {server.result}
                      </pre>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`font-medium ${server.status === ' propagated' ? 'text-green-600' : 'text-red-600'}`}>
                        {server.status}
                      </span>
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

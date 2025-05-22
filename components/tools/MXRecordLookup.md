---
title: "MX Record Lookup Tool"
description: "Check MX records for email delivery"
---

# MX Record Lookup Tool

This tool helps you verify MX (Mail Exchange) records for your domain. MX records are crucial for email delivery and troubleshooting.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * MXRecordLookup Component
 * Description: A tool to check MX records for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Email", "MX", "Tools"]
 */

export const MXRecordLookup = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const lookupMX = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/mxlookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup MX records');
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
      <h3 className="text-xl font-bold mb-4">MX Record Lookup Tool</h3>
      
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
          onClick={lookupMX}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Looking up...' : 'Lookup MX Records'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">MX Records:</h4>
            <Table>
              <Table.Head>
                <Table.HeadCell>Priority</Table.HeadCell>
                <Table.HeadCell>Mail Server</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Details</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {results.servers.map((server) => (
                  <Table.Row key={server.exchange}>
                    <Table.Cell>{server.priority}</Table.Cell>
                    <Table.Cell>{server.exchange}</Table.Cell>
                    <Table.Cell>
                      <span className={`font-medium ${server.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {server.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <ul className="list-disc list-inside text-sm">
                        {server.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
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

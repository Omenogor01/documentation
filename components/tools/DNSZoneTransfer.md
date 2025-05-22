---
title: "DNS Zone Transfer Checker"
description: "Check DNS zone transfers for your domain"
---

# DNS Zone Transfer Checker

This tool helps you verify DNS zone transfers for your domain. Zone transfers are used to replicate DNS records between primary and secondary DNS servers.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * DNSZoneTransfer Component
 * Description: A tool to check DNS zone transfers for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Zone Transfer", "Security", "Tools"]
 */

export const DNSZoneTransfer = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const checkZoneTransfer = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dnszonetransfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check zone transfer');
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
      <h3 className="text-xl font-bold mb-4">DNS Zone Transfer Checker</h3>
      
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
          onClick={checkZoneTransfer}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Zone Transfer'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Zone Transfer Results:</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">Zone Transfer Status:</h5>
                <p className={`font-medium ${results.status === 'allowed' ? 'text-green-600' : 'text-red-600'}`}>
                  {results.status}
                </p>
              </div>

              <div>
                <h5 className="font-medium">Name Servers:</h5>
                <ul className="list-disc list-inside">
                  {results.nameServers.map((server, index) => (
                    <li key={index}>
                      <span className="font-medium">{server.name}</span>
                      <span className="ml-2">({server.ip})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium">Security Recommendations:</h5>
                <ul className="list-disc list-inside">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="text-red-600">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium">Zone Records:</h5>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Record Type</Table.HeadCell>
                    <Table.HeadCell>Host</Table.HeadCell>
                    <Table.HeadCell>Value</Table.HeadCell>
                    <Table.HeadCell>TTL</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {results.records.map((record) => (
                      <Table.Row key={`${record.type}-${record.host}`}>
                        <Table.Cell>{record.type}</Table.Cell>
                        <Table.Cell>{record.host}</Table.Cell>
                        <Table.Cell>
                          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                            {record.value}
                          </pre>
                        </Table.Cell>
                        <Table.Cell>{record.ttl}s</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

---
title: "DNSSEC Validator"
description: "Validate DNSSEC configuration for your domain"
---

# DNSSEC Validator

This tool helps you verify DNSSEC (Domain Name System Security Extensions) configuration for your domain. DNSSEC adds security to DNS by providing origin authentication and data integrity.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * DNSSECValidator Component
 * Description: A tool to validate DNSSEC configuration for a domain
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Security", "DNSSEC", "Tools"]
 */

export const DNSSECValidator = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateDNSSEC = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/dnssecvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate DNSSEC');
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
      <h3 className="text-xl font-bold mb-4">DNSSEC Validator</h3>
      
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
          onClick={validateDNSSEC}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate DNSSEC'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">DNSSEC Validation Results:</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">DNSSEC Status:</h5>
                <p className={`font-medium ${results.status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                  {results.status}
                </p>
              </div>

              <div>
                <h5 className="font-medium">DNSSEC Records:</h5>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Record Type</Table.HeadCell>
                    <Table.HeadCell>Host</Table.HeadCell>
                    <Table.HeadCell>Algorithm</Table.HeadCell>
                    <Table.HeadCell>Key Tag</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {results.records.map((record) => (
                      <Table.Row key={`${record.type}-${record.host}`}>
                        <Table.Cell>{record.type}</Table.Cell>
                        <Table.Cell>{record.host}</Table.Cell>
                        <Table.Cell>{record.algorithm}</Table.Cell>
                        <Table.Cell>{record.keyTag}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div>
                <h5 className="font-medium">Validation Issues:</h5>
                <ul className="list-disc list-inside">
                  {results.issues.map((issue, index) => (
                    <li key={index} className="text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium">Security Recommendations:</h5>
                <ul className="list-disc list-inside">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-600">
                      {rec}
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

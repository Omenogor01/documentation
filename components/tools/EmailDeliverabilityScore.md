---
title: "Email Deliverability Score"
description: "Calculate email deliverability score based on various factors"
---

# Email Deliverability Score

This tool helps you calculate your email deliverability score based on various factors that affect email delivery. A higher score indicates better deliverability.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Progress } from '/snippets/components/ui';

/**
 * EmailDeliverabilityScore Component
 * Description: A tool to calculate email deliverability score
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Email", "Deliverability", "Tools"]
 */

export const EmailDeliverabilityScore = () => {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const calculateScore = async () => {
    if (!email || !domain) {
      setError('Please enter both email and domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/emaildeliverabilityscore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate score');
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
      <h3 className="text-xl font-bold mb-4">Email Deliverability Score</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full"
          />
        </div>

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
          onClick={calculateScore}
          disabled={loading || !email || !domain}
          className="w-full"
        >
          {loading ? 'Calculating...' : 'Calculate Score'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Deliverability Score</h4>
                <div className="flex items-center">
                  <Progress
                    value={results.score}
                    max={100}
                    className="w-full"
                  />
                  <span className="ml-4 font-medium">
                    {results.score}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Score Breakdown</h4>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Factor</Table.HeadCell>
                    <Table.HeadCell>Score</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Details</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {Object.entries(results.factors).map(([factor, info]) => (
                      <Table.Row key={factor}>
                        <Table.Cell>{factor}</Table.Cell>
                        <Table.Cell>
                          <Progress
                            value={info.score}
                            max={100}
                            className="w-24"
                          />
                          {info.score}%
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${info.status === 'good' ? 'text-green-600' : info.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {info.status}
                          </span>
                        </Table.Cell>
                        <Table.Cell>{info.details}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="list-disc list-inside">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-600">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Overall Status</h4>
                <div className="space-y-2">
                  <p className={`font-medium ${results.overallStatus === 'good' ? 'text-green-600' : results.overallStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {results.overallStatus}
                  </p>
                  <p>{results.overallMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

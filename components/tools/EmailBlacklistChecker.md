---
title: "Email Blacklist Checker"
description: "Check email addresses against multiple blacklists"
---

# Email Blacklist Checker

This tool helps you verify if email addresses are listed on various blacklists. Blacklists are used to identify spam sources and prevent email abuse.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * EmailBlacklistChecker Component
 * Description: A tool to check email addresses against multiple blacklists
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Email", "Blacklist", "Tools"]
 */

export const EmailBlacklistChecker = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const checkBlacklist = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/emailblacklistchecker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check blacklists');
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
      <h3 className="text-xl font-bold mb-4">Email Blacklist Checker</h3>
      
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

        <Button
          onClick={checkBlacklist}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Blacklists'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Blacklist Check Results:</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">Overall Status:</h5>
                <p className={`font-medium ${results.isBlacklisted ? 'text-red-600' : 'text-green-600'}`}>
                  {results.isBlacklisted ? 'Blacklisted' : 'Not Blacklisted'}
                </p>
              </div>

              <div>
                <h5 className="font-medium">Blacklist Results:</h5>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Blacklist</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Details</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {results.blacklists.map((blacklist) => (
                      <Table.Row key={blacklist.name}>
                        <Table.Cell>{blacklist.name}</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${blacklist.status === 'listed' ? 'text-red-600' : 'text-green-600'}`}>
                            {blacklist.status}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {blacklist.reason || 'Not listed'}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div>
                <h5 className="font-medium">Recommendations:</h5>
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

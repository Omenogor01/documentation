---
title: "Email Syntax Validator"
description: "Validate email addresses for proper syntax and format"
---

# Email Syntax Validator

This tool helps you verify the syntax and format of email addresses. It checks for proper structure and common patterns.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table } from '/snippets/components/ui';

/**
 * EmailSyntaxValidator Component
 * Description: A tool to validate email address syntax and format
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Email", "Validation", "Tools"]
 */

export const EmailSyntaxValidator = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/emailsyntaxvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate email');
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
      <h3 className="text-xl font-bold mb-4">Email Syntax Validator</h3>
      
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
          onClick={validateEmail}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'Validating...' : 'Validate Email'}
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
                <h5 className="font-medium">Syntax Status:</h5>
                <p className={`font-medium ${results.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {results.isValid ? 'Valid' : 'Invalid'}
                </p>
              </div>

              <div>
                <h5 className="font-medium">Validation Details:</h5>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Component</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Details</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {Object.entries(results.details).map(([component, info]) => (
                      <Table.Row key={component}>
                        <Table.Cell>{component}</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${info.valid ? 'text-green-600' : 'text-red-600'}`}>
                            {info.valid ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>{info.message}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div>
                <h5 className="font-medium">Common Issues:</h5>
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

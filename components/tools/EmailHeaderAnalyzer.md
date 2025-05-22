---
title: "Email Header Analyzer"
description: "Analyze email headers for security and compliance"
---

# Email Header Analyzer

This tool helps you analyze email headers to check for security, authentication, and compliance issues. Email headers contain important information about email routing and security.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * EmailHeaderAnalyzer Component
 * Description: A tool to analyze email headers for security and compliance
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Email", "Security", "Tools"]
 */

export const EmailHeaderAnalyzer = () => {
  const [rawHeaders, setRawHeaders] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('security');

  const analyzeHeaders = async () => {
    if (!rawHeaders) {
      setError('Please enter email headers');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/emailheaderanalyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawHeaders }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze headers');
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
      <h3 className="text-xl font-bold mb-4">Email Header Analyzer</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Headers</label>
          <textarea
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            placeholder="Paste raw email headers here..."
            className="w-full h-32 p-2 border rounded-md"
          />
        </div>

        <Button
          onClick={analyzeHeaders}
          disabled={loading || !rawHeaders}
          className="w-full"
        >
          {loading ? 'Analyzing...' : 'Analyze Headers'}
        </Button>

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-4">
            <Tabs>
              <Tabs.List>
                <Tabs.Tab
                  value="security"
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </Tabs.Tab>
                <Tabs.Tab
                  value="authentication"
                  onClick={() => setActiveTab('authentication')}
                >
                  Authentication
                </Tabs.Tab>
                <Tabs.Tab
                  value="routing"
                  onClick={() => setActiveTab('routing')}
                >
                  Routing
                </Tabs.Tab>
                <Tabs.Tab
                  value="compliance"
                  onClick={() => setActiveTab('compliance')}
                >
                  Compliance
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'security' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Security Analysis</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Header</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.security.map((header) => (
                        <Table.Row key={header.name}>
                          <Table.Cell>{header.name}</Table.Cell>
                          <Table.Cell>
                            <span className={`font-medium ${header.status === 'secure' ? 'text-green-600' : 'text-red-600'}`}>
                              {header.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{header.details}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'authentication' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Authentication Analysis</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Header</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.authentication.map((header) => (
                        <Table.Row key={header.name}>
                          <Table.Cell>{header.name}</Table.Cell>
                          <Table.Cell>
                            <span className={`font-medium ${header.status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                              {header.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{header.details}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'routing' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Routing Analysis</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Header</Table.HeadCell>
                      <Table.HeadCell>Value</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.routing.map((header) => (
                        <Table.Row key={header.name}>
                          <Table.Cell>{header.name}</Table.Cell>
                          <Table.Cell>{header.value}</Table.Cell>
                          <Table.Cell>{header.details}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Compliance Analysis</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Requirement</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.compliance.map((requirement) => (
                        <Table.Row key={requirement.name}>
                          <Table.Cell>{requirement.name}</Table.Cell>
                          <Table.Cell>
                            <span className={`font-medium ${requirement.status === 'compliant' ? 'text-green-600' : 'text-red-600'}`}>
                              {requirement.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{requirement.details}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );
};

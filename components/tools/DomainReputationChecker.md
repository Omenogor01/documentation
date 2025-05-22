---
title: "Domain Reputation Checker"
description: "Check domain reputation and security status"
---

# Domain Reputation Checker

This tool helps you verify the reputation and security status of a domain. Domain reputation is crucial for security and trustworthiness.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * DomainReputationChecker Component
 * Description: A tool to check domain reputation and security status
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Domain", "Security", "Tools"]
 */

export const DomainReputationChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('reputation');

  const checkReputation = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/domainreputationchecker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check reputation');
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
      <h3 className="text-xl font-bold mb-4">Domain Reputation Checker</h3>
      
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
          onClick={checkReputation}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Reputation'}
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
                  value="reputation"
                  onClick={() => setActiveTab('reputation')}
                >
                  Reputation
                </Tabs.Tab>
                <Tabs.Tab
                  value="security"
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </Tabs.Tab>
                <Tabs.Tab
                  value="blacklist"
                  onClick={() => setActiveTab('blacklist')}
                >
                  Blacklist
                </Tabs.Tab>
                <Tabs.Tab
                  value="details"
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'reputation' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Reputation Status</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">Overall Reputation:</h5>
                      <p className={`font-medium ${results.reputation.score >= 75 ? 'text-green-600' : results.reputation.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {results.reputation.score}%
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Trust Score:</h5>
                      <p className={`font-medium ${results.reputation.trust >= 75 ? 'text-green-600' : results.reputation.trust >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {results.reputation.trust}%
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Risk Level:</h5>
                      <p className={`font-medium ${results.reputation.risk === 'low' ? 'text-green-600' : results.reputation.risk === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {results.reputation.risk}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Security Status</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Check</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>SSL/TLS</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.security.ssl ? 'text-green-600' : 'text-red-600'}`}>
                            {results.security.ssl ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.security.sslDetails || 'No SSL/TLS'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Malware</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.security.malware ? 'text-red-600' : 'text-green-600'}`}>
                            {results.security.malware ? 'Detected' : 'Clean'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.security.malwareDetails || 'No malware detected'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Phishing</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.security.phishing ? 'text-red-600' : 'text-green-600'}`}>
                            {results.security.phishing ? 'Detected' : 'Clean'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.security.phishingDetails || 'No phishing detected'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'blacklist' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Blacklist Status</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Blacklist</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.blacklist.map((entry) => (
                        <Table.Row key={entry.name}>
                          <Table.Cell>{entry.name}</Table.Cell>
                          <Table.Cell>
                            <span className={`font-medium ${entry.status === 'listed' ? 'text-red-600' : 'text-green-600'}`}>
                              {entry.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            {entry.reason || 'Not listed'}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Domain Details</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Property</Table.HeadCell>
                      <Table.HeadCell>Value</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Domain Age</Table.Cell>
                        <Table.Cell>
                          {results.details.age} years
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Registration Date</Table.Cell>
                        <Table.Cell>
                          {results.details.registrationDate}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Expiration Date</Table.Cell>
                        <Table.Cell>
                          {results.details.expirationDate}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Registrar</Table.Cell>
                        <Table.Cell>
                          {results.details.registrar}
                        </Table.Cell>
                      </Table.Row>
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

---
title: "Domain Blacklist Checker"
description: "Check domain against multiple blacklists"
---

# Domain Blacklist Checker

This tool helps you verify if a domain is listed on various blacklists. Blacklists are used to identify spam sources and malicious domains.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * DomainBlacklistChecker Component
 * Description: A tool to check domain against multiple blacklists
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Domain", "Blacklist", "Tools"]
 */

export const DomainBlacklistChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('spam');

  const checkBlacklists = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/domainblacklistchecker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
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
      <h3 className="text-xl font-bold mb-4">Domain Blacklist Checker</h3>
      
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
          onClick={checkBlacklists}
          disabled={loading || !domain}
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
            <Tabs>
              <Tabs.List>
                <Tabs.Tab
                  value="spam"
                  onClick={() => setActiveTab('spam')}
                >
                  Spam
                </Tabs.Tab>
                <Tabs.Tab
                  value="malware"
                  onClick={() => setActiveTab('malware')}
                >
                  Malware
                </Tabs.Tab>
                <Tabs.Tab
                  value="phishing"
                  onClick={() => setActiveTab('phishing')}
                >
                  Phishing
                </Tabs.Tab>
                <Tabs.Tab
                  value="security"
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'spam' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Spam Blacklists</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Blacklist</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.spam.map((entry) => (
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

              {activeTab === 'malware' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Malware Blacklists</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Blacklist</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.malware.map((entry) => (
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

              {activeTab === 'phishing' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Phishing Blacklists</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Blacklist</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.phishing.map((entry) => (
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

              {activeTab === 'security' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Security Blacklists</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Blacklist</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.security.map((entry) => (
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

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Summary</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium">Overall Status:</h5>
                    <p className={`font-medium ${results.overallStatus === 'clean' ? 'text-green-600' : 'text-red-600'}`}>
                      {results.overallStatus}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium">Total Blacklists Checked:</h5>
                    <p>{results.totalBlacklists}</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Total Listings:</h5>
                    <p>{results.totalListings}</p>
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
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );
};

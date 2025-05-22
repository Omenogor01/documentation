---
title: "Email Compliance Checker"
description: "Check SPF, DKIM, and DMARC compliance for your domain"
---

# Email Compliance Checker

This tool helps you verify SPF, DKIM, and DMARC compliance for your domain. Proper email authentication is crucial for email deliverability and security.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * EmailComplianceChecker Component
 * Description: A tool to check SPF, DKIM, and DMARC compliance
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Email", "Authentication", "Tools"]
 */

export const EmailComplianceChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('spf');

  const checkCompliance = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/emailcompliancechecker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check compliance');
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
      <h3 className="text-xl font-bold mb-4">Email Compliance Checker</h3>
      
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
          onClick={checkCompliance}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Compliance'}
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
                  value="spf"
                  onClick={() => setActiveTab('spf')}
                >
                  SPF
                </Tabs.Tab>
                <Tabs.Tab
                  value="dkim"
                  onClick={() => setActiveTab('dkim')}
                >
                  DKIM
                </Tabs.Tab>
                <Tabs.Tab
                  value="dmarc"
                  onClick={() => setActiveTab('dmarc')}
                >
                  DMARC
                </Tabs.Tab>
                <Tabs.Tab
                  value="summary"
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'spf' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">SPF Compliance</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Check</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>SPF Record Present</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.spf.record ? 'text-green-600' : 'text-red-600'}`}>
                            {results.spf.record ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.spf.record ? results.spf.record : 'No SPF record found'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>SPF Syntax</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.spf.syntax ? 'text-green-600' : 'text-red-600'}`}>
                            {results.spf.syntax ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.spf.syntax ? 'Valid syntax' : 'Invalid syntax'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>IP Coverage</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.spf.coverage ? 'text-green-600' : 'text-red-600'}`}>
                            {results.spf.coverage ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.spf.coverage ? 'All IPs covered' : 'Missing IP coverage'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'dkim' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">DKIM Compliance</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Check</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>DKIM Record Present</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dkim.record ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dkim.record ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dkim.record ? results.dkim.record : 'No DKIM record found'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>DKIM Syntax</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dkim.syntax ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dkim.syntax ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dkim.syntax ? 'Valid syntax' : 'Invalid syntax'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Key Size</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dkim.keySize ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dkim.keySize ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dkim.keySize ? `Key size: ${results.dkim.keySize} bits` : 'Invalid key size'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'dmarc' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">DMARC Compliance</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Check</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>DMARC Record Present</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dmarc.record ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dmarc.record ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dmarc.record ? results.dmarc.record : 'No DMARC record found'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>DMARC Syntax</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dmarc.syntax ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dmarc.syntax ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dmarc.syntax ? 'Valid syntax' : 'Invalid syntax'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Policy Settings</Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.dmarc.policy ? 'text-green-600' : 'text-red-600'}`}>
                            {results.dmarc.policy ? '✓' : '✗'}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {results.dmarc.policy ? `Policy: ${results.dmarc.policy}` : 'No policy set'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Overall Compliance Summary</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">Authentication Status:</h5>
                      <p className={`font-medium ${results.summary.compliant ? 'text-green-600' : 'text-red-600'}`}>
                        {results.summary.compliant ? 'Compliant' : 'Not Compliant'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Recommendations:</h5>
                      <ul className="list-disc list-inside">
                        {results.summary.recommendations.map((rec, index) => (
                          <li key={index} className="text-blue-600">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );
};

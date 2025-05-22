---
title: "SSL Certificate Validator"
description: "Validate and analyze SSL/TLS certificates"
---

# SSL Certificate Validator

This tool helps you validate and analyze SSL/TLS certificates for any domain. It checks certificate validity, expiration, and configuration.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs, Badge } from '/snippets/components/ui';

/**
 * SSLCertificateValidator Component
 * Description: A tool to validate and analyze SSL/TLS certificates
 * Author: Your Name
 * Last Updated: 2025-05-22
 * Tags: ["SSL", "TLS", "Security", "Tools"]
 */

export const SSLCertificateValidator = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const validateCertificate = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/sslcertvalidator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate certificate');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isValid) => (
    <Badge color={isValid ? 'green' : 'red'}>
      {isValid ? 'Valid' : 'Invalid'}
    </Badge>
  );

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">SSL Certificate Validator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Domain</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && validateCertificate()}
            />
            <Button
              onClick={validateCertificate}
              disabled={loading || !domain}
            >
              {loading ? 'Validating...' : 'Validate'}
            </Button>
          </div>
        </div>

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
                  value="summary"
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </Tabs.Tab>
                <Tabs.Tab
                  value="details"
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </Tabs.Tab>
                <Tabs.Tab
                  value="recommendations"
                  onClick={() => setActiveTab('recommendations')}
                >
                  Recommendations
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'summary' && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Domain</h4>
                      <p>{results.domain}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Status</h4>
                      {getStatusBadge(results.isValid)}
                    </div>
                    <div>
                      <h4 className="font-semibold">Valid From</h4>
                      <p>{new Date(results.validFrom).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Valid Until</h4>
                      <p className={results.daysUntilExpiry <= 30 ? 'text-red-600 font-medium' : ''}>
                        {new Date(results.validTo).toLocaleString()}
                        {results.daysUntilExpiry <= 30 && ` (Expires in ${results.daysUntilExpiry} days)`}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Issuer</h4>
                      <p>{results.issuer}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Signature Algorithm</h4>
                      <p>{results.signatureAlgorithm}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="mt-4">
                  <Table>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Subject</Table.Cell>
                        <Table.Cell>{results.subject || 'N/A'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Issuer</Table.Cell>
                        <Table.Cell>{results.issuer || 'N/A'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Serial Number</Table.Cell>
                        <Table.Cell>{results.serialNumber || 'N/A'}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Key Size</Table.Cell>
                        <Table.Cell>{results.keySize} bits</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Signature Algorithm</Table.Cell>
                        <Table.Cell>{results.signatureAlgorithm}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Fingerprint</Table.Cell>
                        <Table.Cell className="font-mono text-sm">{results.fingerprint}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>OCSP</Table.Cell>
                        <Table.Cell>
                          {results.ocsp ? (
                            <Badge color="green">Supported</Badge>
                          ) : (
                            <Badge color="yellow">Not Supported</Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>CRL</Table.Cell>
                        <Table.Cell>
                          {results.crl ? (
                            <Badge color="green">Supported</Badge>
                          ) : (
                            <Badge color="yellow">Not Supported</Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="mt-4 space-y-4">
                  {results.recommendations && results.recommendations.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="text-yellow-700">
                            {rec.description} {rec.severity === 'high' && '⚠️'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-green-700">No major issues found. The SSL certificate configuration looks good!</p>
                  )}
                  
                  {results.warnings && results.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Warnings</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {results.warnings.map((warning, index) => (
                          <li key={index} className="text-orange-600">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );
};

---
title: "TLS Configuration Tester"
description: "Test and analyze TLS/SSL configurations for any domain"
---

# TLS Configuration Tester

This tool allows you to test and analyze the TLS/SSL configuration of any domain, helping you ensure secure communication and identify potential vulnerabilities.

import React, { useState, useEffect } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs, Badge, Progress, Spinner, Select } from '/snippets/components/ui';

/**
 * TLSConfigurationTester Component
 * Description: A tool to test and analyze TLS/SSL configurations for any domain
 * Author: Your Name
 * Last Updated: 2025-05-22
 * Tags: ["TLS", "SSL", "Security", "Networking"]
 */

export const TLSConfigurationTester = () => {
  const [domain, setDomain] = useState('');
  const [port, setPort] = useState('443');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [testInProgress, setTestInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testOptions, setTestOptions] = useState({
    checkProtocols: true,
    checkCiphers: true,
    checkCertificate: true,
    checkHsts: true,
    checkOcsp: true,
    checkPfs: true,
  });

  const testTLS = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);
    setTestInProgress(true);

    try {
      setCurrentTest('Connecting to server...');
      setProgress(10);
      
      const response = await fetch('/.netlify/functions/tlsconfigtester', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domain.trim().replace(/^https?:\/\//, '').split('/')[0],
          port: parseInt(port) || 443,
          options: testOptions
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to test TLS configuration');
      }

      setResults(data);
      setActiveTab('summary');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTestInProgress(false);
      setProgress(100);
    }
  };

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'green' };
    if (score >= 80) return { grade: 'A', color: 'green' };
    if (score >= 70) return { grade: 'B', color: 'lime' };
    if (score >= 60) return { grade: 'C', color: 'yellow' };
    if (score >= 50) return { grade: 'D', color: 'orange' };
    return { grade: 'F', color: 'red' };
  };

  const getStatusBadge = (status) => {
    if (status === 'good' || status === 'passed' || status === true) {
      return <Badge color="green">Passed</Badge>;
    }
    if (status === 'warning' || status === 'deprecated') {
      return <Badge color="yellow">Warning</Badge>;
    }
    if (status === 'bad' || status === 'failed' || status === false) {
      return <Badge color="red">Failed</Badge>;
    }
    return <Badge>Unknown</Badge>;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">TLS Configuration Tester</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Domain</label>
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="w-full"
              onKeyPress={(e) => e.key === 'Enter' && testTLS()}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Port</label>
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="443"
              className="w-full"
              min="1"
              max="65535"
              disabled={loading}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Test Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries({
              checkProtocols: 'Test Protocols',
              checkCiphers: 'Test Cipher Suites',
              checkCertificate: 'Check Certificate',
              checkHsts: 'Check HSTS',
              checkOcsp: 'Check OCSP Stapling',
              checkPfs: 'Check Perfect Forward Secrecy',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={testOptions[key]}
                  onChange={() => {
                    setTestOptions(prev => ({
                      ...prev,
                      [key]: !prev[key]
                    }));
                  }}
                  className="rounded text-blue-600"
                  disabled={loading}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={testTLS}
            disabled={loading || !domain}
            className="w-full md:w-auto"
          >
            {loading ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Testing...
              </span>
            ) : 'Test TLS Configuration'}
          </Button>
        </div>

        {testInProgress && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{currentTest}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} max={100} className="w-full" />
          </div>
        )}

        {error && (
          <Alert type="error" className="mt-4">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">{results.hostname}</h4>
                <p className="text-sm text-gray-600">
                  IP: {results.ip} • Port: {results.port} • Tested at: {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className={`text-3xl font-bold text-${getGrade(results.overallScore).color}-600`}>
                  {getGrade(results.overallScore).grade}
                </div>
                <div className="text-sm text-gray-600 text-right">
                  Score: {results.overallScore}/100
                </div>
              </div>
            </div>

            <Tabs>
              <Tabs.List>
                <Tabs.Tab
                  value="summary"
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </Tabs.Tab>
                <Tabs.Tab
                  value="certificate"
                  onClick={() => setActiveTab('certificate')}
                  disabled={!results.certificate}
                >
                  Certificate
                </Tabs.Tab>
                <Tabs.Tab
                  value="protocols"
                  onClick={() => setActiveTab('protocols')}
                  disabled={!results.protocols}
                >
                  Protocols
                </Tabs.Tab>
                <Tabs.Tab
                  value="ciphers"
                  onClick={() => setActiveTab('ciphers')}
                  disabled={!results.ciphers}
                >
                  Ciphers
                </Tabs.Tab>
                <Tabs.Tab
                  value="details"
                  onClick={() => setActiveTab('details')}
                >
                  Raw Details
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'summary' && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Security Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.checks && Object.entries(results.checks).map(([key, check]) => (
                        <div key={key} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium">
                              {check.name}
                            </h5>
                            {getStatusBadge(check.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {check.message}
                          </p>
                          {check.recommendation && (
                            <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-xs rounded">
                              {check.recommendation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Certificate Information</h4>
                    {results.certificate ? (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell className="font-medium">Issuer</Table.Cell>
                              <Table.Cell>{results.certificate.issuer?.O || 'Unknown'}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="font-medium">Subject</Table.Cell>
                              <Table.Cell>{results.certificate.subject?.CN || results.hostname}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="font-medium">Valid From</Table.Cell>
                              <Table.Cell>{formatDate(results.certificate.validFrom)}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="font-medium">Expires On</Table.Cell>
                              <Table.Cell>
                                <div className="flex items-center">
                                  <span>{formatDate(results.certificate.validTo)}</span>
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {getDaysRemaining(results.certificate.validTo)} days remaining
                                  </span>
                                </div>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="font-medium">Signature Algorithm</Table.Cell>
                              <Table.Cell>{results.certificate.signatureAlgorithm || 'N/A'}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="font-medium">Key Size</Table.Cell>
                              <Table.Cell>{results.certificate.keySize || 'N/A'}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </div>
                    ) : (
                      <Alert type="info">No certificate information available</Alert>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'certificate' && results.certificate && (
                <div className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium mb-2">Subject</h5>
                      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        {JSON.stringify(results.certificate.subject, null, 2)}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Issuer</h5>
                      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        {JSON.stringify(results.certificate.issuer, null, 2)}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Validity Period</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Valid From</div>
                          <div>{formatDate(results.certificate.validFrom)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Valid To</div>
                          <div className="flex items-center">
                            <span>{formatDate(results.certificate.validTo)}</span>
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                              {getDaysRemaining(results.certificate.validTo)} days remaining
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Fingerprints</h5>
                      <div className="space-y-2">
                        {results.certificate.fingerprint && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">SHA-256</div>
                            <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                              {results.certificate.fingerprint}
                            </div>
                          </div>
                        )}
                        {results.certificate.fingerprint256 && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">SHA-256 (Full Chain)</div>
                            <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                              {results.certificate.fingerprint256}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Extensions</h5>
                      {results.certificate.extensions?.length > 0 ? (
                        <div className="space-y-2">
                          {results.certificate.extensions.map((ext, i) => (
                            <div key={i} className="border rounded p-3">
                              <div className="font-medium">{ext.name}</div>
                              <div className="font-mono text-sm text-gray-600 mt-1 overflow-x-auto">
                                {ext.value || 'No value'}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">No extensions found</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'protocols' && results.protocols && (
                <div className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium mb-3">Supported Protocols</h5>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>Protocol</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Security</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {Object.entries(results.protocols).map(([protocol, details]) => (
                              <Table.Row key={protocol}>
                                <Table.Cell className="font-medium">{protocol}</Table.Cell>
                                <Table.Cell>
                                  {details.supported ? (
                                    <Badge color="green">Supported</Badge>
                                  ) : (
                                    <Badge color="gray">Not Supported</Badge>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  {details.security === 'secure' && <Badge color="green">Secure</Badge>}
                                  {details.security === 'insecure' && <Badge color="red">Insecure</Badge>}
                                  {details.security === 'deprecated' && <Badge color="yellow">Deprecated</Badge>}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Protocol Recommendations</h5>
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                          <div className="font-medium">Recommended Configuration</div>
                          <div className="mt-1 text-sm">
                            Enable TLS 1.2 and 1.3, disable SSL 2.0, 3.0, and TLS 1.0, 1.1
                          </div>
                        </div>
                        {results.protocols['TLSv1.3']?.supported && (
                          <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                            <div className="font-medium">✓ TLS 1.3 is enabled</div>
                            <div className="mt-1 text-sm">
                              TLS 1.3 provides improved security and performance over previous versions.
                            </div>
                          </div>
                        )}
                        {(results.protocols['SSLv2']?.supported || results.protocols['SSLv3']?.supported) && (
                          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                            <div className="font-medium">⚠ Insecure protocols detected</div>
                            <div className="mt-1 text-sm">
                              SSL 2.0 and 3.0 are considered insecure and should be disabled.
                            </div>
                          </div>
                        )}
                        {results.protocols['TLSv1.0']?.supported || results.protocols['TLSv1.1']?.supported ? (
                          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                            <div className="font-medium">⚠ Deprecated protocols in use</div>
                            <div className="mt-1 text-sm">
                              TLS 1.0 and 1.1 are considered deprecated and should be disabled in favor of TLS 1.2 or 1.3.
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                            <div className="font-medium">✓ No deprecated protocols detected</div>
                            <div className="mt-1 text-sm">
                              Only secure protocol versions (TLS 1.2+) are enabled.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ciphers' && results.ciphers && (
                <div className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium mb-3">Supported Cipher Suites</h5>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>Cipher Suite</Table.HeadCell>
                            <Table.HeadCell>Protocol</Table.HeadCell>
                            <Table.HeadCell>Key Exchange</Table.HeadCell>
                            <Table.HeadCell>Encryption</Table.HeadCell>
                            <Table.HeadCell>MAC</Table.HeadCell>
                            <Table.HeadCell>Security</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {results.ciphers.map((cipher, i) => (
                              <Table.Row key={i}>
                                <Table.Cell className="font-mono text-sm">{cipher.name}</Table.Cell>
                                <Table.Cell>{cipher.protocol}</Table.Cell>
                                <Table.Cell>{cipher.keyExchange || 'N/A'}</Table.Cell>
                                <Table.Cell>{cipher.encryption || 'N/A'}</Table.Cell>
                                <Table.Cell>{cipher.mac || 'N/A'}</Table.Cell>
                                <Table.Cell>
                                  {cipher.security === 'secure' && <Badge color="green">Secure</Badge>}
                                  {cipher.security === 'insecure' && <Badge color="red">Insecure</Badge>}
                                  {cipher.security === 'weak' && <Badge color="yellow">Weak</Badge>}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Cipher Suite Recommendations</h5>
                      <div className="space-y-3">
                        {results.ciphers.some(c => c.security === 'insecure') && (
                          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                            <div className="font-medium">⚠ Insecure cipher suites detected</div>
                            <div className="mt-1 text-sm">
                              The following cipher suites are considered insecure and should be disabled:
                              <ul className="list-disc list-inside mt-1">
                                {results.ciphers
                                  .filter(c => c.security === 'insecure')
                                  .map((c, i) => (
                                    <li key={i} className="font-mono text-sm">{c.name}</li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        {results.ciphers.some(c => c.security === 'weak') && (
                          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                            <div className="font-medium">⚠ Weak cipher suites detected</div>
                            <div className="mt-1 text-sm">
                              The following cipher suites are considered weak and should be disabled if not needed:
                              <ul className="list-disc list-inside mt-1">
                                {results.ciphers
                                  .filter(c => c.security === 'weak')
                                  .map((c, i) => (
                                    <li key={i} className="font-mono text-sm">{c.name}</li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                          <div className="font-medium">Recommended Configuration</div>
                          <div className="mt-1 text-sm">
                            <p>For maximum security, use the following cipher suite configuration:</p>
                            <ul className="list-disc list-inside mt-1">
                              <li>Prefer GCM/CCM cipher modes over CBC</li>
                              <li>Use AEAD ciphers when possible (TLS 1.3)</li>
                              <li>Disable NULL and export cipher suites</li>
                              <li>Disable cipher suites using MD5 or SHA-1 MACs</li>
                              <li>Use ECDHE key exchange with strong curves (P-256, P-384)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="mt-4">
                  <h5 className="font-medium mb-3">Raw Test Results</h5>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{JSON.stringify(results, null, 2)}</pre>
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
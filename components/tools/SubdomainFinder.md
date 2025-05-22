---
title: "Subdomain Finder"
description: "Discover subdomains for any domain"
---

# Subdomain Finder

This tool helps you discover subdomains for any domain, which is useful for security testing, penetration testing, and IT administration.

import React, { useState, useEffect } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs, Badge, Progress, Spinner } from '/snippets/components/ui';

/**
 * SubdomainFinder Component
 * Description: A tool to discover subdomains for any domain
 * Author: Your Name
 * Last Updated: 2025-05-22
 * Tags: ["DNS", "Subdomains", "Security", "Tools"]
 */

export const SubdomainFinder = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('subdomains');
  const [currentTest, setCurrentTest] = useState('');
  const [totalTests, setTotalTests] = useState(0);
  const [completedTests, setCompletedTests] = useState(0);

  const findSubdomains = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);
    setCompletedTests(0);
    setTotalTests(0);

    try {
      setCurrentTest('Preparing to scan...');
      
      const response = await fetch('/.netlify/functions/subdomainfinder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domain.trim().replace(/^https?:\/\//, '').split('/')[0] 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to find subdomains');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Update progress when tests are completed
  useEffect(() => {
    if (totalTests > 0 && completedTests > 0) {
      const newProgress = Math.round((completedTests / totalTests) * 100);
      setProgress(newProgress);
    }
  }, [completedTests, totalTests]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge color="green">Verified</Badge>;
      case 'unverified':
        return <Badge color="yellow">Unverified</Badge>;
      case 'error':
        return <Badge color="red">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getRecordTypeBadge = (record) => {
    if (record.A && record.A.length > 0) return <Badge color="blue">A</Badge>;
    if (record.AAAA && record.AAAA.length > 0) return <Badge color="purple">AAAA</Badge>;
    if (record.CNAME && record.CNAME.length > 0) return <Badge color="green">CNAME</Badge>;
    if (record.MX && record.MX.length > 0) return <Badge color="orange">MX</Badge>;
    if (record.TXT && record.TXT.length > 0) return <Badge color="gray">TXT</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const getRecordCount = (record) => {
    return (record.A?.length || 0) + 
           (record.AAAA?.length || 0) + 
           (record.CNAME?.length || 0) + 
           (record.MX?.length || 0) + 
           (record.TXT?.length || 0);
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Subdomain Finder</h3>
      
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
              onKeyPress={(e) => e.key === 'Enter' && findSubdomains()}
            />
            <Button
              onClick={findSubdomains}
              disabled={loading || !domain}
              className="w-32"
            >
              {loading ? (
                <span className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Scanning...
                </span>
              ) : 'Find Subdomains'}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{currentTest}</span>
              <span>{completedTests} / {totalTests} tests</span>
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
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Results for <span className="text-blue-600">{results.domain}</span>
              </h4>
              <div className="text-sm text-gray-600">
                Found {results.subdomains?.length || 0} subdomains
              </div>
            </div>

            <Tabs>
              <Tabs.List>
                <Tabs.Tab
                  value="subdomains"
                  onClick={() => setActiveTab('subdomains')}
                >
                  Subdomains
                </Tabs.Tab>
                <Tabs.Tab
                  value="dns"
                  onClick={() => setActiveTab('dns')}
                  disabled={!results.subdomains?.length}
                >
                  DNS Records
                </Tabs.Tab>
                <Tabs.Tab
                  value="export"
                  onClick={() => setActiveTab('export')}
                  disabled={!results.subdomains?.length}
                >
                  Export
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'subdomains' && (
                <div className="mt-4">
                  {results.subdomains?.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <Table.Head>
                          <Table.HeadCell>Subdomain</Table.HeadCell>
                          <Table.HeadCell>Status</Table.HeadCell>
                          <Table.HeadCell>IP Address</Table.HeadCell>
                          <Table.HeadCell>Records</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                          {results.subdomains.map((subdomain, index) => (
                            <Table.Row key={index}>
                              <Table.Cell className="font-mono">
                                {subdomain.subdomain}.{results.domain}
                              </Table.Cell>
                              <Table.Cell>
                                {getStatusBadge('verified')}
                              </Table.Cell>
                              <Table.Cell className="font-mono text-sm">
                                {subdomain.ip || 'N/A'}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex space-x-1">
                                  {subdomain.records && (
                                    <>
                                      {subdomain.records.A?.length > 0 && <Badge color="blue">A: {subdomain.records.A.length}</Badge>}
                                      {subdomain.records.AAAA?.length > 0 && <Badge color="purple">AAAA: {subdomain.records.AAAA.length}</Badge>}
                                      {subdomain.records.CNAME?.length > 0 && <Badge color="green">CNAME: {subdomain.records.CNAME.length}</Badge>}
                                      {subdomain.records.MX?.length > 0 && <Badge color="orange">MX: {subdomain.records.MX.length}</Badge>}
                                      {subdomain.records.TXT?.length > 0 && <Badge color="gray">TXT: {subdomain.records.TXT.length}</Badge>}
                                    </>
                                  )}
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </div>
                  ) : (
                    <Alert type="info" className="mt-4">
                      No subdomains found for {results.domain}
                    </Alert>
                  )}
                </div>
              )}

              {activeTab === 'dns' && results.subdomains?.length > 0 && (
                <div className="mt-4">
                  <div className="space-y-6">
                    {results.subdomains.map((subdomain, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">
                            {subdomain.subdomain}.{results.domain}
                          </h5>
                          <div className="text-sm text-gray-500">
                            {subdomain.ip && (
                              <span className="font-mono">{subdomain.ip}</span>
                            )}
                          </div>
                        </div>
                        
                        {subdomain.records && (
                          <div className="space-y-3">
                            {subdomain.records.A?.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-1">A Records</h6>
                                <div className="space-y-1">
                                  {subdomain.records.A.map((record, i) => (
                                    <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                                      {record}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {subdomain.records.AAAA?.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-1">AAAA Records</h6>
                                <div className="space-y-1">
                                  {subdomain.records.AAAA.map((record, i) => (
                                    <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                                      {record}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {subdomain.records.CNAME?.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-1">CNAME Records</h6>
                                <div className="space-y-1">
                                  {subdomain.records.CNAME.map((record, i) => (
                                    <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                                      {record}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {subdomain.records.MX?.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-1">MX Records</h6>
                                <div className="space-y-1">
                                  {subdomain.records.MX.map((record, i) => (
                                    <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                                      {record.priority} {record.exchange}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {subdomain.records.TXT?.length > 0 && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 mb-1">TXT Records</h6>
                                <div className="space-y-1">
                                  {subdomain.records.TXT.map((record, i) => (
                                    <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                                      {record.join(' ')}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'export' && results.subdomains?.length > 0 && (
                <div className="mt-4">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          const text = results.subdomains
                            .map(s => `${s.subdomain}.${results.domain}`)
                            .join('\n');
                          navigator.clipboard.writeText(text);
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                      <Button
                        onClick={() => {
                          const text = results.subdomains
                            .map(s => `${s.subdomain}.${results.domain}`)
                            .join('\n');
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `subdomains-${results.domain}-${new Date().toISOString().split('T')[0]}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download as TXT
                      </Button>
                      <Button
                        onClick={() => {
                          const json = JSON.stringify(results, null, 2);
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `subdomains-${results.domain}-${new Date().toISOString().split('T')[0]}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download as JSON
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Subdomains ({results.subdomains.length} found)
                      </label>
                      <div className="border rounded p-3 bg-gray-50 font-mono text-sm h-64 overflow-y-auto">
                        {results.subdomains
                          .map(s => `${s.subdomain}.${results.domain}`)
                          .join('\n')}
                      </div>
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

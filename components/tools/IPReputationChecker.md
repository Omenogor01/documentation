---
title: "IP Reputation Checker"
description: "Check the reputation of any IP address against multiple threat intelligence sources"
---

# IP Reputation Checker

This tool allows you to check the reputation of any IP address against multiple threat intelligence sources to identify potential security threats.

import React, { useState, useEffect } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Badge, Spinner, Tabs, Tab } from '/snippets/components/ui';

/**
 * IPReputationChecker Component
 * Description: A tool to check IP reputation against threat intelligence sources
 * Author: Your Name
 * Last Updated: 2025-05-22
 * Tags: ["security", "networking", "tools", "threat-intelligence"]
 */

export const IPReputationChecker = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('results');

  // Get user's public IP on component mount
  useEffect(() => {
    const fetchMyIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error('Error fetching IP:', err);
      }
    };
    
    fetchMyIP();
  }, []);

  const checkIPReputation = async () => {
    if (!ipAddress) {
      setError('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      setError('Please enter a valid IPv4 address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/ipreputation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ipAddress }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check IP reputation');
      }

      // Add to history
      const newHistory = [
        { ip: ipAddress, timestamp: new Date().toISOString(), ...data },
        ...history.slice(0, 4) // Keep only the 5 most recent
      ];
      setHistory(newHistory);
      setResults(data);
      setActiveTab('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelBadge = (level) => {
    const levels = {
      high: { color: 'red', label: 'High Risk' },
      medium: { color: 'yellow', label: 'Medium Risk' },
      low: { color: 'green', label: 'Low Risk' },
      unknown: { color: 'gray', label: 'Unknown' }
    };
    
    const { color, label } = levels[level] || levels.unknown;
    return <Badge color={color}>{label}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categories = {
      vpn: { color: 'blue', label: 'VPN' },
      proxy: { color: 'purple', label: 'Proxy' },
      tor: { color: 'dark', label: 'TOR' },
      malicious: { color: 'red', label: 'Malicious' },
      spam: { color: 'orange', label: 'Spam' },
      scanning: { color: 'yellow', label: 'Scanning' },
      hosting: { color: 'indigo', label: 'Hosting' },
    };
    
    const { color, label } = categories[category] || { color: 'gray', label: category };
    return <Badge color={color} className="mr-1 mb-1">{label}</Badge>;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">IP Reputation Checker</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">IP Address</label>
            <Input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address"
              className="w-full"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={checkIPReputation}
              disabled={loading || !ipAddress}
              className="w-full md:w-auto"
            >
              {loading ? (
                <span className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Checking...
                </span>
              ) : 'Check Reputation'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mt-2">
            {error}
          </Alert>
        )}

        {(results || history.length > 0) && (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <div className="flex border-b border-gray-200 mb-4">
              <Tab value="results" active={activeTab === 'results'} disabled={!results}>
                Results
              </Tab>
              <Tab value="history" active={activeTab === 'history'} disabled={history.length === 0}>
                History {history.length > 0 && `(${history.length})`}
              </Tab>
            </div>
            
            <div className="tab-content">
              {activeTab === 'results' && results && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">IP Address</h4>
                      <p className="text-lg font-mono">{results.ip}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Threat Level</h4>
                      <div className="mt-1">
                        {getThreatLevelBadge(results.threat_level || 'unknown')}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Confidence</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (results.confidence_score || 0) > 70 ? 'bg-red-500' : 
                            (results.confidence_score || 0) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${results.confidence_score || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{results.confidence_score || 0}% confidence</p>
                    </div>
                  </div>

                  {results.categories && results.categories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.categories.map((cat, i) => (
                          <span key={i}>
                            {getCategoryBadge(cat.toLowerCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.details && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Detailed Information</h4>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>Source</Table.Head>
                            <Table.HeadCell>Status</Table.Head>
                            <Table.HeadCell>Details</Table.Head>
                            <Table.HeadCell>Last Seen</Table.Head>
                          </Table.Head>
                          <Table.Body>
                            {Object.entries(results.details).map(([source, data]) => (
                              <Table.Row key={source}>
                                <Table.Cell className="font-medium">
                                  {source.charAt(0).toUpperCase() + source.slice(1)}
                                </Table.Cell>
                                <Table.Cell>
                                  {data.found ? (
                                    <Badge color="red">Reported</Badge>
                                  ) : (
                                    <Badge color="green">Clean</Badge>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  {data.details || 'No threats detected'}
                                </Table.Cell>
                                <Table.Cell>
                                  {data.last_seen || 'N/A'}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                  )}

                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Recommendations</h4>
                      <div className="space-y-3">
                        {results.recommendations.map((rec, i) => (
                          <div key={i} className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  {rec.title}
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>{rec.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <Table.Head>
                        <Table.HeadCell>IP Address</Table.Head>
                        <Table.HeadCell>Threat Level</Table.Head>
                        <Table.HeadCell>Categories</Table.Head>
                        <Table.HeadCell>Last Checked</Table.Head>
                        <Table.HeadCell>Actions</Table.Head>
                      </Table.Head>
                      <Table.Body>
                        {history.map((item, i) => (
                          <Table.Row key={i}>
                            <Table.Cell className="font-mono">{item.ip}</Table.Cell>
                            <Table.Cell>
                              {getThreatLevelBadge(item.threat_level || 'unknown')}
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex flex-wrap gap-1">
                                {(item.categories || []).slice(0, 2).map((cat, j) => (
                                  <span key={j}>
                                    {getCategoryBadge(cat.toLowerCase())}
                                  </span>
                                ))}
                                {(item.categories || []).length > 2 && (
                                  <Badge color="gray" className="cursor-help" title={item.categories.join(', ')}>
                                    +{item.categories.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              {new Date(item.timestamp).toLocaleString()}
                            </Table.Cell>
                            <Table.Cell>
                              <Button 
                                size="xs" 
                                variant="ghost"
                                onClick={() => {
                                  setIpAddress(item.ip);
                                  setResults(item);
                                  setActiveTab('results');
                                }}
                              >
                                View
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </Card>
  );
};

export default IPReputationChecker;

---
title: "Reverse DNS Lookup"
description: "Perform reverse DNS lookup for IP addresses"
---

# Reverse DNS Lookup

This tool helps you perform reverse DNS lookups for IP addresses. Reverse DNS lookup is used to find the domain name associated with an IP address.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * ReverseDNSLookup Component
 * Description: A tool to perform reverse DNS lookups
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["DNS", "Reverse", "Tools"]
 */

export const ReverseDNSLookup = () => {
  const [ip, setIP] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('lookup');

  const performLookup = async () => {
    if (!ip) {
      setError('Please enter an IP address');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/reversednslookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform lookup');
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
      <h3 className="text-xl font-bold mb-4">Reverse DNS Lookup</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">IP Address</label>
          <Input
            type="text"
            value={ip}
            onChange={(e) => setIP(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full"
          />
        </div>

        <Button
          onClick={performLookup}
          disabled={loading || !ip}
          className="w-full"
        >
          {loading ? 'Looking up...' : 'Lookup'}
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
                  value="lookup"
                  onClick={() => setActiveTab('lookup')}
                >
                  Lookup Results
                </Tabs.Tab>
                <Tabs.Tab
                  value="details"
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </Tabs.Tab>
                <Tabs.Tab
                  value="validation"
                  onClick={() => setActiveTab('validation')}
                >
                  Validation
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'lookup' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Reverse DNS Results</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">IP Address:</h5>
                      <p className="font-medium">{results.ip}</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Domain Name:</h5>
                      <p className={`font-medium ${results.domainName ? 'text-green-600' : 'text-red-600'}`}>
                        {results.domainName || 'No domain name found'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">PTR Record:</h5>
                      <p className={`font-medium ${results.ptrRecord ? 'text-green-600' : 'text-red-600'}`}>
                        {results.ptrRecord || 'No PTR record found'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Status:</h5>
                      <p className={`font-medium ${results.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {results.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Additional Details</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Property</Table.HeadCell>
                      <Table.HeadCell>Value</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>IP Version</Table.Cell>
                        <Table.Cell>
                          {results.details.ipVersion}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.details.ipVersion === 'IPv4' || results.details.ipVersion === 'IPv6' ? 'text-green-600' : 'text-red-600'}`}>
                            {results.details.ipVersion}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>IP Class</Table.Cell>
                        <Table.Cell>
                          {results.details.ipClass}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.details.ipClass ? 'text-green-600' : 'text-yellow-600'}`}>
                            {results.details.ipClass}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Network Range</Table.Cell>
                        <Table.Cell>
                          {results.details.networkRange}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.details.networkRange ? 'text-green-600' : 'text-yellow-600'}`}>
                            {results.details.networkRange}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'validation' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Validation Results</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">IP Validation:</h5>
                      <p className={`font-medium ${results.validation.ipValid ? 'text-green-600' : 'text-red-600'}`}>
                        {results.validation.ipValid ? 'Valid' : 'Invalid'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">DNS Record Validation:</h5>
                      <p className={`font-medium ${results.validation.dnsValid ? 'text-green-600' : 'text-red-600'}`}>
                        {results.validation.dnsValid ? 'Valid' : 'Invalid'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">PTR Record Validation:</h5>
                      <p className={`font-medium ${results.validation.ptrValid ? 'text-green-600' : 'text-red-600'}`}>
                        {results.validation.ptrValid ? 'Valid' : 'Invalid'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Recommendations:</h5>
                      <ul className="list-disc list-inside">
                        {results.validation.recommendations.map((rec, index) => (
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

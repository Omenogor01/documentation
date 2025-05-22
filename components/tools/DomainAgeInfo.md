---
title: "Domain Age & Registration Info"
description: "Check domain age and registration details"
---

# Domain Age & Registration Info

This tool helps you verify the age and registration details of a domain. Domain age and registration information are important for security and trustworthiness.

import React, { useState } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Tabs } from '/snippets/components/ui';

/**
 * DomainAgeInfo Component
 * Description: A tool to check domain age and registration details
 * Author: Your Name
 * Last Updated: 2025-05-18
 * Tags: ["Domain", "Registration", "Tools"]
 */

export const DomainAgeInfo = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('age');

  const checkDomainInfo = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/domainageinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check domain info');
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
      <h3 className="text-xl font-bold mb-4">Domain Age & Registration Info</h3>
      
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
          onClick={checkDomainInfo}
          disabled={loading || !domain}
          className="w-full"
        >
          {loading ? 'Checking...' : 'Check Info'}
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
                  value="age"
                  onClick={() => setActiveTab('age')}
                >
                  Age
                </Tabs.Tab>
                <Tabs.Tab
                  value="registration"
                  onClick={() => setActiveTab('registration')}
                >
                  Registration
                </Tabs.Tab>
                <Tabs.Tab
                  value="history"
                  onClick={() => setActiveTab('history')}
                >
                  History
                </Tabs.Tab>
                <Tabs.Tab
                  value="analysis"
                  onClick={() => setActiveTab('analysis')}
                >
                  Analysis
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'age' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Domain Age</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">Total Age:</h5>
                      <p className="font-medium">
                        {results.age.total} years
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Creation Date:</h5>
                      <p className="font-medium">
                        {results.age.creationDate}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Expiration Date:</h5>
                      <p className="font-medium">
                        {results.age.expirationDate}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Renewal Status:</h5>
                      <p className={`font-medium ${results.age.renewalStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {results.age.renewalStatus}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'registration' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Registration Details</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Property</Table.HeadCell>
                      <Table.HeadCell>Value</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Registrar</Table.Cell>
                        <Table.Cell>
                          {results.registration.registrar}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.registration.registrarStatus === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {results.registration.registrarStatus}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Registrant</Table.Cell>
                        <Table.Cell>
                          {results.registration.registrant}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.registration.registrantStatus === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {results.registration.registrantStatus}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Registration Status</Table.Cell>
                        <Table.Cell>
                          {results.registration.status}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={`font-medium ${results.registration.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {results.registration.status}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Domain History</h4>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Date</Table.HeadCell>
                      <Table.HeadCell>Change Type</Table.HeadCell>
                      <Table.HeadCell>Details</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {results.history.map((entry) => (
                        <Table.Row key={entry.date}>
                          <Table.Cell>{entry.date}</Table.Cell>
                          <Table.Cell>
                            {entry.type}
                          </Table.Cell>
                          <Table.Cell>
                            {entry.details}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Domain Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">Age Analysis:</h5>
                      <p className="font-medium">
                        {results.analysis.ageAnalysis}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Registration Stability:</h5>
                      <p className="font-medium">
                        {results.analysis.registrationStability}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Renewal Pattern:</h5>
                      <p className="font-medium">
                        {results.analysis.renewalPattern}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Recommendations:</h5>
                      <ul className="list-disc list-inside">
                        {results.analysis.recommendations.map((rec, index) => (
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

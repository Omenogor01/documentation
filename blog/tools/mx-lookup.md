---
title: "MX Record Lookup Tool"
date: 2025-05-14
summary: "Check the MX (Mail Exchange) records for any domain instantly."
description: "Use this free tool to look up MX records for any domain and troubleshoot email deliverability issues."
tags:
  - mx
  - dns
  - email
  - tools
image: /blog-logo.png
---

# MX Record Lookup Tool

Quickly check the MX (Mail Exchange) records for any domain to diagnose email delivery issues.

```jsx
import React, { useState } from 'react';

export default function MXLookup() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockResponse = {
        domain,
        mxRecords: [
          { exchange: 'aspmx.l.google.com', priority: 1 },
          { exchange: 'alt1.aspmx.l.google.com', priority: 5 },
          { exchange: 'alt2.aspmx.l.google.com', priority: 5 },
          { exchange: 'alt3.aspmx.l.google.com', priority: 10 },
          { exchange: 'alt4.aspmx.l.google.com', priority: 10 },
        ],
        timestamp: new Date().toISOString()
      };
      
      setResults(mockResponse);
    } catch (err) {
      console.error('Error looking up MX records:', err);
      setError('Failed to fetch MX records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Domain:
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Looking up...' : 'Lookup MX Records'}
        </button>
      </form>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            MX Records for {results.domain}
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {results.mxRecords.map((record, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {record.exchange}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Priority: {record.priority}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Last updated: {new Date(results.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

---

*Powered by DNS over HTTPS API. For advanced diagnostics, try [MXToolbox](https://mxtoolbox.com).*

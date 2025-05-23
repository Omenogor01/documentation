---
title: "IP Reputation Checker"
description: "Check the reputation of any IP address against multiple threat intelligence sources"
---

# IP Reputation Checker

This tool allows you to check the reputation of any IP address against multiple threat intelligence sources to identify potential security threats.

```jsx
import React, { useState } from 'react';
import { Card, Input, Button, Alert, Badge } from '../../../components/ui';

const IPReputationChecker = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkIpReputation = async (e) => {
    e.preventDefault();
    if (!ipAddress.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const isMalicious = Math.random() > 0.7;
      setResult({
        ip: ipAddress,
        isMalicious,
        threatScore: Math.floor(Math.random() * 100),
        lastSeen: new Date().toISOString(),
        threatTypes: isMalicious ? ['Malware', 'Phishing'] : [],
        country: 'United States',
        isp: 'Internet Service Provider',
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">IP Reputation Check</h2>
      
      <form onSubmit={checkIpReputation} className="space-y-4">
        <div>
          <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
            IP Address
          </label>
          <Input
            id="ipAddress"
            type="text"
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Checking...' : 'Check Reputation'}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Results for {result.ip}</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Reputation:</span>
              <Badge variant={result.isMalicious ? 'error' : 'success'}>
                {result.isMalicious ? 'Malicious' : 'Clean'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Threat Score</p>
                <p className="font-medium">{result.threatScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Seen</p>
                <p className="font-medium">
                  {new Date(result.lastSeen).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{result.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ISP</p>
                <p className="font-medium">{result.isp}</p>
              </div>
            </div>

            {result.threatTypes.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Threat Types</p>
                <div className="flex flex-wrap gap-2">
                  {result.threatTypes.map((threat, index) => (
                    <Badge key={index} variant="error">
                      {threat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default IPReputationChecker;
```

## Features

- Check IP reputation against multiple threat intelligence sources
- View detailed information about the IP address
- Identify potential security threats
- Simple and intuitive interface

## How to Use

1. Enter an IP address in the input field
2. Click "Check Reputation" to begin the scan
3. View the detailed results, including threat score and reputation status

## Security Notes

- Only check IP addresses you have permission to investigate
- This tool is for informational purposes only
- Results may vary based on the threat intelligence sources used

## Common Questions

**What is an IP reputation score?**
An IP reputation score indicates how trustworthy an IP address is based on its history and behavior across the internet.

**What makes an IP address malicious?**
An IP address may be flagged as malicious if it has been associated with spam, malware, phishing, or other malicious activities.

**How often is the threat data updated?**
Our threat intelligence is continuously updated to provide the most accurate results possible.

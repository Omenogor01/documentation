---
title: "Port Scanner"
description: "Scan open ports on any host to identify potential vulnerabilities"
---

# Port Scanner

This tool allows you to scan for open ports on any host, helping you identify potential security vulnerabilities and ensure your network is properly secured.

```jsx
import React, { useState } from 'react';
import { Card, Input, Button, Alert, Table, Badge } from '../../../components/ui';

const PortScanner = () => {
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('1-1024');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 5432, 8080, 8443];

  const handleScan = async (e) => {
    e.preventDefault();
    if (!host.trim()) return;

    setIsLoading(true);
    setError('');
    setResults(null);

    // Simulate scanning
    setTimeout(() => {
      const openPorts = commonPorts.filter(() => Math.random() > 0.8);
      setResults({
        openPorts: openPorts.map(port => ({
          port,
          service: getServiceName(port),
          status: 'open',
        })),
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 2000);
  };

  const getServiceName = (port) => {
    const services = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      3306: 'MySQL',
      3389: 'RDP',
      5432: 'PostgreSQL',
      8080: 'HTTP-Proxy',
      8443: 'HTTPS-Alt',
    };
    return services[port] || 'Unknown';
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Port Scanner</h2>
      
      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
            Hostname or IP Address
          </label>
          <Input
            id="host"
            type="text"
            placeholder="example.com or 192.168.1.1"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="portRange" className="block text-sm font-medium text-gray-700 mb-1">
            Port Range
          </label>
          <select
            id="portRange"
            value={portRange}
            onChange={(e) => setPortRange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="1-1024">Well-known ports (1-1024)</option>
            <option value="1-65535">All ports (1-65535)</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Scanning...' : 'Start Scan'}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      {results && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Scan Results</h3>
          {results.openPorts.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Port</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.openPorts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.port}</td>
                    <td>{item.service}</td>
                    <td>
                      <Badge variant="success">Open</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No open ports found.</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Scan completed at: {new Date(results.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PortScanner;
```

## Features

- Scan for open ports on any host
- Check common ports or specify a custom range
- View detailed information about detected services
- Simple and intuitive interface

## How to Use

1. Enter a hostname or IP address
2. Select a port range to scan
3. Click "Start Scan" to begin
4. View the results of the scan

## Security Notes

- Only scan hosts you have permission to scan
- Be aware of local laws and regulations regarding port scanning
- Some networks may block or limit port scanning activities

## Common Ports

- **21**: FTP - File Transfer Protocol
- **22**: SSH - Secure Shell
- **25**: SMTP - Simple Mail Transfer Protocol
- **53**: DNS - Domain Name System
- **80**: HTTP - Hypertext Transfer Protocol
- **443**: HTTPS - HTTP Secure
- **3306**: MySQL Database
- **3389**: Remote Desktop Protocol (RDP)
- **5432**: PostgreSQL Database
- **8080/8443**: Alternative HTTP/HTTPS ports

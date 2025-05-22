---
title: "Port Scanner"
description: "Scan open ports on any host to identify potential vulnerabilities"
---

# Port Scanner

This tool allows you to scan for open ports on any host, helping you identify potential security vulnerabilities and ensure your network is properly secured.

import React, { useState, useEffect } from '/snippets/react';
import { Card, Input, Button, Alert, Table, Badge, Progress, Spinner, Select } from '/snippets/components/ui';

/**
 * PortScanner Component
 * Description: A tool to scan for open ports on any host
 * Author: Your Name
 * Last Updated: 2025-05-22
 * Tags: ["security", "networking", "tools", "port-scanning"]
 */

export const PortScanner = () => {
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('1-1024');
  const [scanType, setScanType] = useState('common');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [scannedPorts, setScannedPorts] = useState(0);
  const [totalPorts, setTotalPorts] = useState(0);

  const commonPorts = [
    21, 22, 23, 25, 53, 80, 110, 115, 135, 139, 143, 194, 443, 445, 
    587, 993, 995, 1433, 1521, 2049, 3306, 3389, 5432, 5900, 6379, 
    8080, 8443, 27017, 27018, 27019
  ];

  const getPortsToScan = () => {
    if (scanType === 'common') {
      return commonPorts;
    }
    
    if (scanType === 'range') {
      const [start, end] = portRange.split('-').map(Number);
      const ports = [];
      for (let i = start; i <= end; i++) {
        ports.push(i);
      }
      return ports;
    }
    
    return [];
  };

  const scanPorts = async () => {
    if (!host) {
      setError('Please enter a host');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);
    
    const ports = getPortsToScan();
    setTotalPorts(ports.length);
    setScannedPorts(0);

    try {
      const response = await fetch('/.netlify/functions/portscanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          host: host.trim(),
          ports: ports,
          scanType: scanType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan ports');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const getPortStatusBadge = (status) => {
    if (status === 'open') return <Badge color="green">Open</Badge>;
    if (status === 'filtered') return <Badge color="yellow">Filtered</Badge>;
    if (status === 'closed') return <Badge color="gray">Closed</Badge>;
    return <Badge color="red">Error</Badge>;
  };

  const getServiceName = (port) => {
    const portServices = {
      21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
      80: 'HTTP', 110: 'POP3', 115: 'SFTP', 135: 'MS RPC', 139: 'NetBIOS',
      143: 'IMAP', 194: 'IRC', 443: 'HTTPS', 445: 'SMB', 587: 'SMTP',
      993: 'IMAPS', 995: 'POP3S', 1433: 'MSSQL', 1521: 'Oracle', 2049: 'NFS',
      3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 5900: 'VNC', 6379: 'Redis',
      8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB', 27018: 'MongoDB Shard', 27019: 'MongoDB Config'
    };
    return portServices[port] || 'Unknown';
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Port Scanner</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Host</label>
            <Input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com or IP address"
              className="w-full"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Scan Type</label>
            <Select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="w-full"
              disabled={loading}
            >
              <option value="common">Common Ports</option>
              <option value="range">Custom Range</option>
              <option value="quick">Quick Scan (Top 1000)</option>
            </Select>
          </div>
          
          {scanType === 'range' && (
            <div>
              <label className="block text-sm font-medium mb-1">Port Range</label>
              <div className="flex">
                <Input
                  type="text"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  placeholder="1-1024"
                  className="flex-1"
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={scanPorts}
            disabled={loading || !host}
            className="w-full md:w-auto"
          >
            {loading ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Scanning...
              </span>
            ) : 'Start Scan'}
          </Button>
        </div>

        {loading && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Scanning ports... ({scannedPorts}/{totalPorts})</span>
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
                <h4 className="font-semibold">Scan Results for {results.host}</h4>
                <p className="text-sm text-gray-600">
                  Scanned {results.scannedPorts} ports • {results.openPorts.length} open • {results.filteredPorts} filtered • {results.closedPorts} closed
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">{results.openPorts.length} Open</span> • 
                  <span className="text-yellow-600 font-medium"> {results.filteredPorts} Filtered</span> • 
                  <span className="text-gray-500"> {results.closedPorts} Closed</span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  Completed in {results.scanDuration} seconds
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Port</Table.Head>
                  <Table.HeadCell>Service</Table.Head>
                  <Table.HeadCell>Status</Table.Head>
                  <Table.HeadCell>Protocol</Table.Head>
                  <Table.HeadCell>Banner</Table.Head>
                </Table.Head>
                <Table.Body>
                  {results.scanResults.map((result, i) => (
                    <Table.Row key={i}>
                      <Table.Cell className="font-medium">{result.port}</Table.Cell>
                      <Table.Cell>{getServiceName(result.port)}</Table.Cell>
                      <Table.Cell>{getPortStatusBadge(result.status)}</Table.Cell>
                      <Table.Cell>{result.protocol || 'TCP'}</Table.Cell>
                      <Table.Cell className="text-xs truncate max-w-xs">
                        {result.banner || 'N/A'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-3">Security Recommendations</h5>
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
                            {rec.remediation && (
                              <div className="mt-2">
                                <p className="font-medium">Remediation:</p>
                                <p className="mt-1">{rec.remediation}</p>
                              </div>
                            )}
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
      </div>
    </Card>
  );
};

export default PortScanner;
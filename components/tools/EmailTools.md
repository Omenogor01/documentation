---
title: "Email List Tools"
description: "A comprehensive suite of tools for managing and validating email lists"
---

# Email List Tools

A powerful collection of tools for managing, cleaning, and validating email lists. Choose from the tools below to get started.

import React, { useState } from '/snippets/react';
import { Card, Tabs, Tab, Button, Badge, Alert, Spinner } from '/snippets/components/ui';
import { FiMail, FiCheck, FiCopy, FiFilter, FiTrash2, FiSearch, FiDownload } from 'react-icons/fi';

/**
 * EmailTools Component
 * A suite of email list management tools
 * Features:
 * - Email List Cleaner
 * - Duplicate Email Finder
 * - Invalid Email Detector
 * - Domain-Based Email Filter
 */

export const EmailTools = () => {
  const [activeTab, setActiveTab] = useState('cleaner');
  const [loading, setLoading] = useState(false);

  const tools = [
    {
      id: 'cleaner',
      title: 'Email List Cleaner',
      description: 'Clean and validate your email list by removing invalid, duplicate, and risky email addresses',
      icon: <FiCheck className="mr-2" />,
      badge: 'Popular',
      badgeColor: 'blue'
    },
    {
      id: 'duplicate',
      title: 'Duplicate Email Finder',
      description: 'Find and remove duplicate email addresses from your list',
      icon: <FiCopy className="mr-2" />,
      badge: 'New',
      badgeColor: 'green'
    },
    {
      id: 'invalid',
      title: 'Invalid Email Detector',
      description: 'Identify and remove invalid email addresses from your list',
      icon: <FiFilter className="mr-2" />,
      badge: 'Essential',
      badgeColor: 'red'
    },
    {
      id: 'domain',
      title: 'Domain-Based Email Filter',
      description: 'Filter email addresses by domain, including or excluding specific domains',
      icon: <FiSearch className="mr-2" />,
      badge: 'Advanced',
      badgeColor: 'purple'
    },
    {
      id: 'bulk',
      title: 'Bulk Email Processor',
      description: 'Process multiple email lists with custom rules and filters',
      icon: <FiDownload className="mr-2" />,
      badge: 'Pro',
      badgeColor: 'yellow'
    }
  ];

  const renderToolContent = () => {
    switch (activeTab) {
      case 'cleaner':
        return <EmailListCleaner />;
      case 'duplicate':
        return <DuplicateEmailFinder />;
      case 'invalid':
        return <InvalidEmailDetector />;
      case 'domain':
        return <DomainBasedFilter />;
      case 'bulk':
        return <BulkEmailProcessor />;
      default:
        return (
          <div className="text-center py-12">
            <FiMail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Select a Tool</h3>
            <p className="mt-1 text-gray-500">Choose from the tools above to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Email List Tools</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage, clean, and validate your email lists with our comprehensive suite of tools
          </p>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Tab 
                  key={tool.id}
                  value={tool.id}
                  active={activeTab === tool.id}
                  className="flex items-center"
                >
                  {tool.icon}
                  {tool.title}
                  {tool.badge && (
                    <Badge color={tool.badgeColor} className="ml-2">
                      {tool.badge}
                    </Badge>
                  )}
                </Tab>
              ))}
            </div>
          </Tabs>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            renderToolContent()
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Why Use Our Email Tools?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Improve Deliverability',
                description: 'Reduce bounce rates and improve your sender reputation by cleaning your email lists regularly.',
                icon: <FiCheck className="h-6 w-6 text-green-500" />
              },
              {
                title: 'Save Money',
                description: 'Reduce costs by removing invalid and inactive email addresses from your mailing lists.',
                icon: <FiCheck className="h-6 w-6 text-blue-500" />
              },
              {
                title: 'Better Engagement',
                description: 'Reach real, engaged subscribers who are interested in your content.',
                icon: <FiCheck className="h-6 w-6 text-purple-500" />
              }
            ].map((feature, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">{feature.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Tool Components
const EmailListCleaner = () => {
  const [emails, setEmails] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      const emailList = emails.split(/[\n,;\s]+/).filter(Boolean);
      const uniqueEmails = [...new Set(emailList)];
      
      setResults({
        total: emailList.length,
        duplicates: emailList.length - uniqueEmails.length,
        unique: uniqueEmails.length,
        cleanedList: uniqueEmails.join('\n')
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Email List Cleaner</h3>
        <p className="text-sm text-gray-500">
          Paste your email list below to remove duplicates and invalid addresses
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-1">
            Email Addresses (one per line or comma/semicolon separated)
          </label>
          <textarea
            id="emails"
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="user1@example.com\nuser2@example.com\nuser3@example.com"
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={!emails.trim() || loading}>
            {loading ? 'Processing...' : 'Clean Email List'}
          </Button>
        </div>
      </form>
      
      {results && (
        <div className="mt-6 space-y-4">
          <h4 className="text-md font-medium text-gray-900">Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold">{results.total}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Duplicates Removed</p>
              <p className="text-2xl font-bold text-blue-600">{results.duplicates}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-700">Unique Emails</p>
              <p className="text-2xl font-bold text-green-600">{results.unique}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="cleaned-list" className="block text-sm font-medium text-gray-700">
                Cleaned Email List
              </label>
              <Button size="sm" variant="outline" onClick={() => {
                navigator.clipboard.writeText(results.cleanedList);
              }}>
                <FiCopy className="mr-1" /> Copy to Clipboard
              </Button>
            </div>
            <textarea
              id="cleaned-list"
              rows={10}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              value={results.cleanedList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DuplicateEmailFinder = () => {
  return (
    <div className="text-center py-12">
      <FiCopy className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Duplicate Email Finder</h3>
      <p className="mt-1 text-gray-500">Coming soon</p>
    </div>
  );
};

const InvalidEmailDetector = () => {
  return (
    <div className="text-center py-12">
      <FiFilter className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Invalid Email Detector</h3>
      <p className="mt-1 text-gray-500">Coming soon</p>
    </div>
  );
};

const DomainBasedFilter = () => {
  return (
    <div className="text-center py-12">
      <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Domain-Based Email Filter</h3>
      <p className="mt-1 text-gray-500">Coming soon</p>
    </div>
  );
};

const BulkEmailProcessor = () => {
  return (
    <div className="text-center py-12">
      <FiDownload className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Bulk Email Processor</h3>
      <p className="mt-1 text-gray-500">Coming soon</p>
    </div>
  );
};

export default EmailTools;

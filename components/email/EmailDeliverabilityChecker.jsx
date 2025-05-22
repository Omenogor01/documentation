import React, { useState } from 'react';
import { Card, Button, Tabs, Tab, Alert, Spinner } from '@mintlify/components';

// Icons
const DnsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MailOpenIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BanIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckIcon = ({ className = '' }) => (
  <svg className={`h-5 w-5 text-green-500 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className = '' }) => (
  <svg className={`h-5 w-5 text-red-500 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EmailDeliverabilityChecker = () => {
  const [activeTab, setActiveTab] = useState('dns');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');

  const tabs = [
    { id: 'dns', name: 'DNS Records', icon: <DnsIcon /> },
    { id: 'auth', name: 'Email Auth', icon: <ShieldIcon /> },
    { id: 'headers', name: 'Header Analyzer', icon: <MailOpenIcon /> },
    { id: 'blacklist', name: 'Blacklist Check', icon: <BanIcon /> },
    { id: 'reputation', name: 'Domain Reputation', icon: <StarIcon /> },
  ];

  const checkDeliverability = async () => {
    if (!domain) {
      setError('Please enter a domain name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API calls for each check
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would be API calls
      setResults({
        dns: {
          mx: { valid: true, value: `mx1.${domain}.` },
          spf: { valid: true, value: 'v=spf1 include:_spf.google.com ~all' },
          dkim: { valid: true, value: 'k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAA...' },
          dmarc: { valid: true, value: 'v=DMARC1; p=none; rua=mailto:postmaster@example.com' },
        },
        auth: {
          spf: { valid: true, score: 100, details: 'SPF record is properly configured' },
          dkim: { valid: true, score: 100, details: 'DKIM signature is valid' },
          dmarc: { valid: true, score: 100, details: 'DMARC policy is properly configured' },
          overall: { valid: true, score: 100 }
        },
        blacklist: {
          listed: false,
          services: [
            { name: 'Spamhaus', listed: false },
            { name: 'Barracuda', listed: false },
            { name: 'SORBS', listed: false },
          ]
        },
        reputation: {
          score: 85,
          status: 'Good',
          details: 'Your domain has a good sender reputation',
          factors: [
            { name: 'Spam Complaints', score: 90 },
            { name: 'Bounce Rate', score: 88 },
            { name: 'Engagement', score: 80 },
          ]
        },
        headers: {
          received: [
            { from: 'mx1.example.com', by: 'mx.google.com', with: 'ESMTPS', date: new Date().toISOString() },
          ],
          authentication: {
            spf: 'PASS',
            dkim: 'PASS',
            dmarc: 'PASS'
          },
          security: {
            tls: 'TLSv1.3',
            cipher: 'TLS_AES_256_GCM_SHA384'
          }
        }
      });
    } catch (err) {
      setError('Failed to check deliverability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDnsRecords = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">DNS Records for {domain}</h3>
      {results.dns ? (
        <div className="space-y-6">
          {Object.entries(results.dns).map(([type, data]) => (
            <div key={type} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{type.toUpperCase()} Record</h4>
                {data.valid ? <CheckIcon /> : <XIcon />}
              </div>
              <div className="mt-2 p-3 bg-gray-50 rounded font-mono text-sm overflow-x-auto">
                {data.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Enter a domain and click "Check" to view DNS records</p>
      )}
    </div>
  );

  const renderAuthResults = () => (
    <div className="space-y-6">
      {results.auth ? (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Email Authentication Results
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Authentication status for {domain}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {Object.entries(results.auth).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 odd:bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {typeof value === 'object' ? (
                        <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                      ) : value.toString()}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Check authentication status for {domain || 'your domain'}</p>
      )}
    </div>
  );

  const renderBlacklistCheck = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Blacklist Check</h3>
      {results.blacklist ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className={`flex items-center justify-between ${results.blacklist.listed ? 'text-red-600' : 'text-green-600'}`}>
              <h4 className="text-lg font-medium">
                {results.blacklist.listed ? 'Blacklisted' : 'Not Blacklisted'}
              </h4>
              {results.blacklist.listed ? <XIcon className="h-8 w-8" /> : <CheckIcon className="h-8 w-8" />}
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-500">Blacklist Status by Service</h5>
              <div className="mt-2 space-y-2">
                {results.blacklist.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium">{service.name}</span>
                    {service.listed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Listed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Not Listed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Check if your domain is on any email blacklists</p>
      )}
    </div>
  );

  const renderReputation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Domain Reputation</h3>
      {results.reputation ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold">{results.reputation.score}/100</h4>
                <p className="text-sm text-gray-500">Sender Score</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                results.reputation.score > 80 ? 'bg-green-100 text-green-800' :
                results.reputation.score > 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {results.reputation.status}
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Reputation Factors</h5>
              <div className="space-y-3">
                {results.reputation.factors.map((factor, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{factor.name}</span>
                      <span className="font-medium">{factor.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          factor.score > 80 ? 'bg-green-500' :
                          factor.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h5 className="text-sm font-medium text-blue-800">Recommendations</h5>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                {results.reputation.score > 80 ? (
                  <li>✓ Your domain has an excellent reputation. Keep up the good work!</li>
                ) : results.reputation.score > 60 ? (
                  <>
                    <li>• Monitor your bounce rates and spam complaints</li>
                    <li>• Ensure you're following email best practices</li>
                  </>
                ) : (
                  <>
                    <li>• Review your email sending practices</li>
                    <li>• Clean your email list to remove invalid addresses</li>
                    <li>• Consider using double opt-in for new subscribers</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Check your domain's email sending reputation</p>
      )}
    </div>
  );

  const renderHeaderAnalyzer = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Email Header Analyzer</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <label htmlFor="emailHeaders" className="block text-sm font-medium text-gray-700 mb-2">
              Paste email headers
            </label>
            <textarea
              id="emailHeaders"
              rows={8}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 font-mono text-sm"
              placeholder="Received: from mail.example.com (mail.example.com [192.0.2.1])..."
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Analyze Headers
              </button>
            </div>
          </div>

          {results.headers && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium mb-4">Analysis Results</h4>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Authentication Results</h5>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">SPF</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            results.headers.authentication.spf === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {results.headers.authentication.spf}
                          </span>
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">DKIM</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            results.headers.authentication.dkim === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {results.headers.authentication.dkim}
                          </span>
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">DMARC</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            results.headers.authentication.dmarc === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {results.headers.authentication.dmarc}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Security</h5>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">TLS Version</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {results.headers.security.tls}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Cipher</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                          {results.headers.security.cipher}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Header Path</h5>
                  <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs text-gray-800 whitespace-pre">
                      {results.headers.received.map((recv, i) => (
                        <div key={i} className="mb-2 pb-2 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                          <span className="font-semibold">Received:</span> from {recv.from} by {recv.by} with {recv.with}; {new Date(recv.date).toLocaleString()}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-5xl mx-auto">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Email Deliverability Toolkit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Check and improve your email deliverability with these essential tools
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
              Domain or Email Address
            </label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com or user@example.com"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={checkDeliverability}
              disabled={loading || !domain.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Checking...
                </>
              ) : 'Check Deliverability'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <div>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          <div className="mt-6">
            {activeTab === 'dns' && renderDnsRecords()}
            {activeTab === 'auth' && renderAuthResults()}
            {activeTab === 'blacklist' && renderBlacklistCheck()}
            {activeTab === 'reputation' && renderReputation()}
            {activeTab === 'headers' && renderHeaderAnalyzer()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmailDeliverabilityChecker;

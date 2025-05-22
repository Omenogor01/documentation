import React, { useState } from 'react';
import { Card, Button, Alert } from '@mintlify/components';

// Icons (using simple SVG components as before)
const ServerIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const KeyIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const EnvelopeIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SmtpTester = () => {
  const [activeTab, setActiveTab] = useState('connection');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    host: '',
    port: '587',
    secure: false,
    username: '',
    password: '',
    from: '',
    to: '',
    subject: 'SMTP Test Email',
    text: 'This is a test email from SMTP Tester',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const testConnection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call to test SMTP connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      setResult({
        success: true,
        message: 'Successfully connected to SMTP server',
        details: {
          host: formData.host,
          port: formData.port,
          secure: formData.secure,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      setError('Failed to connect to SMTP server. Please check your settings and try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testAuthentication = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please provide both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call to test authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      setResult({
        success: true,
        message: 'Authentication successful',
        details: {
          username: formData.username,
          mechanism: 'PLAIN',
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testEmailSending = async (e) => {
    e.preventDefault();
    if (!formData.to) {
      setError('Please provide a recipient email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call to send test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      setResult({
        success: true,
        message: 'Test email sent successfully',
        details: {
          from: formData.from,
          to: formData.to,
          subject: formData.subject,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      setError('Failed to send test email. Please check your settings and try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const renderConnectionTest = () => (
    <form onSubmit={testConnection} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleChange}
            placeholder="smtp.example.com"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
          <select
            name="port"
            value={formData.port}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="25">25 (Not recommended)</option>
            <option value="465">465 (SSL/TLS)</option>
            <option value="587">587 (STARTTLS - Recommended)</option>
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="secure"
          name="secure"
          checked={formData.secure}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="secure" className="ml-2 block text-sm text-gray-700">
          Use secure connection (TLS/SSL)
        </label>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !formData.host}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </form>
  );

  const renderAuthTest = () => (
    <form onSubmit={testAuthentication} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="SMTP username"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="SMTP password"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !formData.username || !formData.password}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Test Authentication'}
        </button>
      </div>
    </form>
  );

  const renderEmailTest = () => (
    <form onSubmit={testEmailSending} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input
            type="email"
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="sender@example.com"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Email</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="recipient@example.com"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !formData.from || !formData.to}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </div>
    </form>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('connection')}
            className={`${activeTab === 'connection' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <div className="flex items-center">
              <ServerIcon className="mr-2 h-5 w-5" />
              Connection Test
            </div>
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`${activeTab === 'auth' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <div className="flex items-center">
              <KeyIcon className="mr-2 h-5 w-5" />
              Authentication Test
            </div>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`${activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            <div className="flex items-center">
              <EnvelopeIcon className="mr-2 h-5 w-5" />
              Send Test Email
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {activeTab === 'connection' && renderConnectionTest()}
        {activeTab === 'auth' && renderAuthTest()}
        {activeTab === 'email' && renderEmailTest()}

        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.success ? (
                  <CheckIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <XIcon className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </h3>
                {result.details && (
                  <div className="mt-2 text-sm text-gray-700">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmtpTester;

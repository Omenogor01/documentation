const axios = require('axios');

// Header analysis rules
const SECURITY_HEADERS = [
  'DKIM-Signature',
  'DMARC-Result',
  'Authentication-Results',
  'X-Spam-Status',
  'X-Spam-Score',
  'X-Virus-Scanned',
];

const AUTH_HEADERS = [
  'DKIM-Signature',
  'DKIM-Verification',
  'SPF',
  'DMARC',
  'Authentication-Results',
];

const ROUTING_HEADERS = [
  'Received',
  'Return-Path',
  'Message-ID',
  'Date',
  'MIME-Version',
];

const COMPLIANCE_HEADERS = [
  'X-Mailer',
  'X-Priority',
  'X-MSMail-Priority',
  'Precedence',
  'X-MS-TNEF-Correlator',
];

exports.handler = async (event) => {
  const { rawHeaders } = JSON.parse(event.body);

  if (!rawHeaders) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email headers are required' }),
    };
  }

  try {
    // Parse headers
    const headers = rawHeaders.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    // Security analysis
    const security = SECURITY_HEADERS.map(header => {
      const status = headers[header] ? 'secure' : 'missing';
      return {
        name: header,
        status,
        details: status === 'secure' ? 'Header present' : 'Header missing'
      };
    });

    // Authentication analysis
    const authentication = AUTH_HEADERS.map(header => {
      const status = headers[header] ? 'valid' : 'invalid';
      return {
        name: header,
        status,
        details: status === 'valid' ? 'Header present and valid' : 'Header missing or invalid'
      };
    });

    // Routing analysis
    const routing = ROUTING_HEADERS.map(header => {
      return {
        name: header,
        value: headers[header] || 'Not present',
        details: headers[header] ? 'Header present' : 'Header missing'
      };
    });

    // Compliance analysis
    const compliance = COMPLIANCE_HEADERS.map(header => {
      const status = headers[header] ? 'compliant' : 'non-compliant';
      return {
        name: header,
        status,
        details: status === 'compliant' ? 'Header present' : 'Header missing'
      };
    });

    // Additional security checks
    const securityIssues = [];
    
    // Check for suspicious headers
    if (headers['X-Spam-Status'] === 'Yes') {
      securityIssues.push('Marked as spam');
    }

    if (headers['X-Virus-Scanned'] !== 'Yes') {
      securityIssues.push('Not virus scanned');
    }

    // Check for authentication failures
    const authFailures = [];
    if (headers['Authentication-Results']?.includes('fail')) {
      authFailures.push('Authentication failure');
    }

    if (headers['SPF']?.includes('fail')) {
      authFailures.push('SPF check failed');
    }

    // Generate recommendations
    const recommendations = [];
    if (securityIssues.length > 0) {
      recommendations.push('Review security headers');
      recommendations.push('Implement proper email security');
    }

    if (authFailures.length > 0) {
      recommendations.push('Fix authentication issues');
      recommendations.push('Implement proper email authentication');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        security,
        authentication,
        routing,
        compliance,
        securityIssues,
        authFailures,
        recommendations,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};

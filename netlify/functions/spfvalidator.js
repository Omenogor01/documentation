const dns = require('dns');

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get TXT records
    const txtRecords = await new Promise((resolve, reject) => {
      dns.resolveTxt(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    // Find SPF record
    let spfRecord = null;
    let issues = [];
    let isValid = false;

    // Check each TXT record for SPF
    for (const record of txtRecords) {
      const txt = record.join('');
      if (txt.startsWith('v=spf1')) {
        spfRecord = txt;
        break;
      }
    }

    if (!spfRecord) {
      issues.push('No SPF record found');
    } else {
      // Basic SPF validation
      isValid = true;
      
      // Check for common issues
      if (!spfRecord.includes('v=spf1')) {
        issues.push('SPF record does not start with v=spf1');
        isValid = false;
      }

      if (spfRecord.length > 255) {
        issues.push('SPF record exceeds maximum length of 255 characters');
        isValid = false;
      }

      // Check for multiple SPF records
      if (txtRecords.filter(record => record.join('').startsWith('v=spf1')).length > 1) {
        issues.push('Multiple SPF records found - only one SPF record per domain is allowed');
        isValid = false;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        spfRecord,
        isValid,
        issues,
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

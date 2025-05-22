const dns = require('dns');

exports.handler = async (event) => {
  const { domain, selector } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get TXT record for DKIM
    const dkimDomain = `${selector}._domainkey.${domain}`;
    const txtRecords = await new Promise((resolve, reject) => {
      dns.resolveTxt(dkimDomain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    let dkimRecord = null;
    let issues = [];
    let isValid = false;

    // Check each TXT record for DKIM
    for (const record of txtRecords) {
      const txt = record.join('');
      if (txt.startsWith('v=DKIM1')) {
        dkimRecord = txt;
        break;
      }
    }

    if (!dkimRecord) {
      issues.push('No DKIM record found');
    } else {
      // Basic DKIM validation
      isValid = true;
      
      // Check for common issues
      if (!dkimRecord.includes('v=DKIM1')) {
        issues.push('DKIM record does not start with v=DKIM1');
        isValid = false;
      }

      if (dkimRecord.length > 255) {
        issues.push('DKIM record exceeds maximum length of 255 characters');
        isValid = false;
      }

      // Check for required tags
      const requiredTags = ['k', 'p'];
      for (const tag of requiredTags) {
        if (!dkimRecord.includes(tag + '=')) {
          issues.push(`Missing required tag: ${tag}`);
          isValid = false;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        selector,
        dkimRecord,
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

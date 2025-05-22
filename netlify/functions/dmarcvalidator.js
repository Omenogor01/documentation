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
    // Get TXT record for DMARC
    const dmarcDomain = `_dmarc.${domain}`;
    const txtRecords = await new Promise((resolve, reject) => {
      dns.resolveTxt(dmarcDomain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    let dmarcRecord = null;
    let issues = [];
    let isValid = false;
    let settings = {};

    // Check each TXT record for DMARC
    for (const record of txtRecords) {
      const txt = record.join('');
      if (txt.startsWith('v=DMARC1')) {
        dmarcRecord = txt;
        break;
      }
    }

    if (!dmarcRecord) {
      issues.push('No DMARC record found');
    } else {
      // Parse DMARC record
      isValid = true;
      
      // Check for common issues
      if (!dmarcRecord.includes('v=DMARC1')) {
        issues.push('DMARC record does not start with v=DMARC1');
        isValid = false;
      }

      // Parse settings
      const parts = dmarcRecord.split(';').map(part => part.trim());
      for (const part of parts) {
        if (part.includes('=')) {
          const [key, value] = part.split('=').map(p => p.trim());
          settings[key] = value;
        }
      }

      // Validate required settings
      const requiredSettings = ['p', 'rua', 'ruf'];
      for (const setting of requiredSettings) {
        if (!settings[setting]) {
          issues.push(`Missing required setting: ${setting}`);
          isValid = false;
        }
      }

      // Validate policy settings
      const validPolicies = ['none', 'quarantine', 'reject'];
      if (settings.p && !validPolicies.includes(settings.p)) {
        issues.push(`Invalid policy setting: ${settings.p}`);
        isValid = false;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        dmarcRecord,
        isValid,
        issues,
        settings,
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

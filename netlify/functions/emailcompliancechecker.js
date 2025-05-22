const dns = require('dns');
const axios = require('axios');

// SPF validation
const validateSPF = async (domain) => {
  try {
    const records = await new Promise((resolve, reject) => {
      dns.resolveTxt(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    const spfRecords = records.filter(record => record[0].startsWith('v=spf1'));
    if (spfRecords.length === 0) {
      return {
        record: false,
        syntax: false,
        coverage: false,
        error: 'No SPF record found'
      };
    }

    const spfRecord = spfRecords[0][0];
    const syntaxValid = spfRecord.match(/^v=spf1\s+([\w-]+\s+)*[-~]?all$/);
    const ipCoverage = spfRecord.includes('ip4:') || spfRecord.includes('ip6:') || spfRecord.includes('mx');

    return {
      record: true,
      syntax: syntaxValid,
      coverage: ipCoverage,
      error: null,
      record: spfRecord
    };
  } catch (error) {
    return {
      record: false,
      syntax: false,
      coverage: false,
      error: error.message
    };
  }
};

// DKIM validation
const validateDKIM = async (domain) => {
  try {
    const selector = 'default';
    const dkimDomain = `_domainkey.${domain}`;
    const records = await new Promise((resolve, reject) => {
      dns.resolveTxt(dkimDomain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    const dkimRecords = records.filter(record => record[0].startsWith('v=DKIM1'));
    if (dkimRecords.length === 0) {
      return {
        record: false,
        syntax: false,
        keySize: false,
        error: 'No DKIM record found'
      };
    }

    const dkimRecord = dkimRecords[0][0];
    const syntaxValid = dkimRecord.match(/^v=DKIM1\s+p=[\w+\/=]+$/);
    const keySize = dkimRecord.match(/p=([\w+\/=]+)/);
    const key = keySize ? keySize[1] : '';
    const decodedKey = Buffer.from(key, 'base64').toString();
    const keyLength = decodedKey.length;

    return {
      record: true,
      syntax: syntaxValid,
      keySize: keyLength >= 2048,
      error: null,
      record: dkimRecord
    };
  } catch (error) {
    return {
      record: false,
      syntax: false,
      keySize: false,
      error: error.message
    };
  }
};

// DMARC validation
const validateDMARC = async (domain) => {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const records = await new Promise((resolve, reject) => {
      dns.resolveTxt(dmarcDomain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    const dmarcRecords = records.filter(record => record[0].startsWith('v=DMARC1'));
    if (dmarcRecords.length === 0) {
      return {
        record: false,
        syntax: false,
        policy: false,
        error: 'No DMARC record found'
      };
    }

    const dmarcRecord = dmarcRecords[0][0];
    const syntaxValid = dmarcRecord.match(/^v=DMARC1\s+p=[\w]+/);
    const policy = dmarcRecord.match(/p=([\w]+)/);
    const policyValue = policy ? policy[1] : '';

    return {
      record: true,
      syntax: syntaxValid,
      policy: policyValue,
      error: null,
      record: dmarcRecord
    };
  } catch (error) {
    return {
      record: false,
      syntax: false,
      policy: false,
      error: error.message
    };
  }
};

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Validate all three protocols
    const [spf, dkim, dmarc] = await Promise.all([
      validateSPF(domain),
      validateDKIM(domain),
      validateDMARC(domain)
    ]);

    // Generate summary
    const summary = {
      compliant: spf.record && dkim.record && dmarc.record &&
                 spf.syntax && dkim.syntax && dmarc.syntax &&
                 spf.coverage && dkim.keySize,
      recommendations: []
    };

    // Generate recommendations
    if (!spf.record) {
      summary.recommendations.push('Add SPF record');
    }
    if (!dkim.record) {
      summary.recommendations.push('Add DKIM record');
    }
    if (!dmarc.record) {
      summary.recommendations.push('Add DMARC record');
    }
    if (!spf.syntax) {
      summary.recommendations.push('Fix SPF syntax');
    }
    if (!dkim.syntax) {
      summary.recommendations.push('Fix DKIM syntax');
    }
    if (!dmarc.syntax) {
      summary.recommendations.push('Fix DMARC syntax');
    }
    if (!spf.coverage) {
      summary.recommendations.push('Update SPF with proper IP coverage');
    }
    if (!dkim.keySize) {
      summary.recommendations.push('Use stronger DKIM key (minimum 2048 bits)');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        spf,
        dkim,
        dmarc,
        summary,
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

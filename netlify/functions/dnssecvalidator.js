const dns = require('dns');
const crypto = require('crypto');

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get DNSSEC records
    const dnskeyRecords = await new Promise((resolve, reject) => {
      dns.resolve(domain, 'DNSKEY', (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    const dsRecords = await new Promise((resolve, reject) => {
      dns.resolve(domain, 'DS', (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    // Validate DNSSEC configuration
    let status = 'valid';
    const issues = [];
    const recommendations = [];
    const records = [];

    // Check DNSKEY records
    if (!dnskeyRecords || dnskeyRecords.length === 0) {
      status = 'invalid';
      issues.push('No DNSKEY records found');
      recommendations.push('Add DNSKEY records for DNSSEC');
    } else {
      dnskeyRecords.forEach(record => {
        records.push({
          type: 'DNSKEY',
          host: domain,
          algorithm: record.algorithm,
          keyTag: record.keyTag,
          flags: record.flags,
          protocol: record.protocol,
          publicKey: record.publicKey,
        });
      });
    }

    // Check DS records
    if (!dsRecords || dsRecords.length === 0) {
      status = 'invalid';
      issues.push('No DS records found');
      recommendations.push('Add DS records at parent zone');
    } else {
      dsRecords.forEach(record => {
        records.push({
          type: 'DS',
          host: domain,
          algorithm: record.algorithm,
          keyTag: record.keyTag,
          digestType: record.digestType,
          digest: record.digest,
        });
      });
    }

    // Check key signing key (KSK)
    const ksk = dnskeyRecords.find(key => key.flags & 256);
    if (!ksk) {
      status = 'invalid';
      issues.push('No key signing key (KSK) found');
      recommendations.push('Configure a key signing key');
    }

    // Check zone signing key (ZSK)
    const zsk = dnskeyRecords.find(key => !(key.flags & 256));
    if (!zsk) {
      status = 'invalid';
      issues.push('No zone signing key (ZSK) found');
      recommendations.push('Configure a zone signing key');
    }

    // Check key sizes
    const keySizes = dnskeyRecords.map(key => key.publicKey.length * 8);
    if (keySizes.some(size => size < 1024)) {
      recommendations.push('Consider using larger key sizes (minimum 1024 bits)');
    }

    // Check algorithm support
    const algorithms = dnskeyRecords.map(key => key.algorithm);
    const unsupportedAlgorithms = algorithms.filter(alg => alg > 8);
    if (unsupportedAlgorithms.length > 0) {
      recommendations.push('Consider using more widely supported algorithms');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        status,
        records,
        issues,
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

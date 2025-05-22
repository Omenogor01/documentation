const https = require('https');
const tls = require('tls');
const { promisify } = require('util');
const dns = require('dns').promises;

// Constants
const TIMEOUT = 10000; // 10 seconds
const PORTS = [443, 8443]; // Common HTTPS ports to check
const RECOMMENDED_MIN_KEY_SIZE = 2048; // Minimum recommended key size in bits
const WARNING_DAYS = 30; // Warn if certificate expires in less than 30 days

// Promisify socket connection
const socketConnect = (options) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(options, () => {
      socket.end();
      resolve(socket);
    });

    socket.on('error', (error) => {
      socket.destroy();
      reject(error);
    });

    socket.setTimeout(TIMEOUT, () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
  });
};

// Get certificate info from a host and port
const getCertificate = async (host, port) => {
  const options = {
    host,
    port,
    rejectUnauthorized: false,
    servername: host, // SNI
    agent: false,
  };

  try {
    const socket = await socketConnect(options);
    const cert = socket.getPeerCertificate(true);
    
    // Get the full certificate chain if available
    const certChain = [cert];
    let currentCert = cert;
    while (currentCert.issuerCertificate && 
           currentCert.issuerCertificate !== currentCert && 
           !currentCert.issuerCertificate.fingerprint.includes(currentCert.fingerprint)) {
      certChain.push(currentCert.issuerCertificate);
      currentCert = currentCert.issuerCertificate;
    }

    return {
      valid: true,
      cert: {
        ...cert,
        validFrom: new Date(cert.valid_from).toISOString(),
        validTo: new Date(cert.valid_to).toISOString(),
        daysUntilExpiry: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24)),
        keySize: cert.bits,
        serialNumber: cert.serialNumber,
        fingerprint: cert.fingerprint256 || cert.fingerprint,
        issuer: cert.issuer ? cert.issuer.O || cert.issuer.CN || 'Unknown' : 'Unknown',
        subject: cert.subject ? cert.subject.CN || cert.subject.O || cert.subject.OU || 'Unknown' : 'Unknown',
        san: cert.subjectaltname || '',
        ocsp: cert.ocsp && cert.ocsp.length > 0,
        crl: cert.crlDistributionPoints && cert.crlDistributionPoints.length > 0,
        issuerCertificate: undefined, // Remove circular reference
        raw: undefined, // Remove raw data to reduce response size
        issuerCertificate: undefined,
        certChain: certChain.map(c => ({
          subject: c.subject ? c.subject.CN || c.subject.O || c.subject.OU || 'Unknown' : 'Unknown',
          issuer: c.issuer ? c.issuer.O || c.issuer.CN || 'Unknown' : 'Unknown',
          validFrom: new Date(c.valid_from).toISOString(),
          validTo: new Date(c.valid_to).toISOString(),
          keySize: c.bits,
          signatureAlgorithm: c.signatureAlgorithm,
        })),
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

// Check if domain has valid DNS records
const checkDns = async (domain) => {
  try {
    await dns.resolve4(domain);
    return true;
  } catch (error) {
    try {
      await dns.resolve6(domain);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Main handler
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse request body
    const { domain } = JSON.parse(event.body);
    
    if (!domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain is required' }),
      };
    }

    // Check if domain is valid and has DNS records
    const hasDns = await checkDns(domain);
    if (!hasDns) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain does not have valid DNS records' }),
      };
    }

    // Try to get certificate from common ports
    let certificate = null;
    let lastError = null;

    for (const port of PORTS) {
      try {
        const result = await getCertificate(domain, port);
        if (result.valid) {
          certificate = result.cert;
          break;
        } else {
          lastError = result.error;
        }
      } catch (error) {
        lastError = error.message;
      }
    }

    if (!certificate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: `Could not retrieve certificate for ${domain}: ${lastError || 'No valid certificate found'}` 
        }),
      };
    }

    // Generate recommendations
    const recommendations = [];
    const warnings = [];
    const now = new Date();
    const expiryDate = new Date(certificate.validTo);
    const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

    // Check certificate expiration
    if (daysUntilExpiry < 0) {
      recommendations.push({
        description: 'Certificate has expired',
        severity: 'high',
      });
    } else if (daysUntilExpiry <= WARNING_DAYS) {
      recommendations.push({
        description: `Certificate will expire in ${daysUntilExpiry} days`,
        severity: 'medium',
      });
    }

    // Check key size
    if (certificate.keySize < RECOMMENDED_MIN_KEY_SIZE) {
      recommendations.push({
        description: `Key size (${certificate.keySize} bits) is below recommended minimum of ${RECOMMENDED_MIN_KEY_SIZE} bits`,
        severity: 'high',
      });
    }

    // Check for weak signature algorithm
    const weakAlgorithms = ['sha1', 'md5', 'md4', 'md2'];
    const isWeakAlgorithm = weakAlgorithms.some(algo => 
      certificate.signatureAlgorithm.toLowerCase().includes(algo)
    );
    
    if (isWeakAlgorithm) {
      recommendations.push({
        description: `Weak signature algorithm detected: ${certificate.signatureAlgorithm}`,
        severity: 'high',
      });
    }

    // Check for OCSP stapling
    if (!certificate.ocsp) {
      warnings.push('OCSP stapling is not enabled. This can improve SSL/TLS handshake performance.');
    }

    // Check for CRL
    if (!certificate.crl) {
      warnings.push('Certificate Revocation List (CRL) is not configured.');
    }

    // Prepare response
    const response = {
      domain,
      isValid: daysUntilExpiry > 0,
      validFrom: certificate.validFrom,
      validTo: certificate.validTo,
      daysUntilExpiry,
      issuer: certificate.issuer,
      subject: certificate.subject,
      serialNumber: certificate.serialNumber,
      keySize: certificate.keySize,
      signatureAlgorithm: certificate.signatureAlgorithm,
      fingerprint: certificate.fingerprint,
      ocsp: certificate.ocsp,
      crl: certificate.crl,
      san: certificate.san,
      certificateChain: certificate.certChain,
      recommendations: recommendations,
      warnings: warnings,
      checkedAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while validating the certificate',
        details: error.message 
      }),
    };
  }
};

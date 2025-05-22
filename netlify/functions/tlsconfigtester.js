const tls = require('tls');
const { promisify } = require('util');
const dns = require('dns').promises;

// Constants
const TIMEOUT = 5000; // 5 seconds per test
const SECURE_PROTOCOLS = ['TLSv1.3', 'TLSv1.2'];
const WEAK_PROTOCOLS = ['TLSv1.1', 'TLSv1.0', 'SSLv3', 'SSLv2'];
const INSECURE_CIPHERS = [
  'TLS_RSA_',
  'TLS_DH_',
  'TLS_ECDH_',
  'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA',
  'TLS_ECDHE_ECDSA_WITH_3DES_EDE_CBC_SHA',
  'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
  'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
  'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
  'TLS_RSA_WITH_AES_128_CBC_SHA256',
  'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
  'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
  'TLS_RSA_WITH_AES_128_CBC_SHA',
  'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
  'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
  'TLS_RSA_WITH_AES_256_CBC_SHA',
];

// Promisify socket connection
const testTlsConnection = (options) => {
  return new Promise((resolve) => {
    const socket = tls.connect(options, () => {
      const result = {
        success: true,
        protocol: socket.getProtocol(),
        cipher: socket.getCipher(),
        certificate: socket.getCertificate(),
        ephemeralKeyInfo: socket.getEphemeralKeyInfo(),
        session: socket.getSession(),
      };
      socket.end();
      resolve(result);
    });

    socket.on('error', (error) => {
      socket.destroy();
      resolve({
        success: false,
        error: error.message,
        code: error.code,
      });
    });

    socket.setTimeout(TIMEOUT, () => {
      socket.destroy();
      resolve({
        success: false,
        error: 'Connection timeout',
        code: 'ETIMEDOUT',
      });
    });
  });
};

// Check if domain has valid DNS records
const checkDns = async (domain) => {
  try {
    await dns.lookup(domain);
    return true;
  } catch (error) {
    return false;
  }
};

// Check if a cipher is considered secure
const isSecureCipher = (cipher) => {
  return !INSECURE_CIPHERS.some(insecure => cipher.includes(insecure));
};

// Generate security recommendations
const generateRecommendations = (results) => {
  const recommendations = [];
  const warnings = [];
  const supportedProtocols = results.protocols.filter(p => p.supported);
  const supportedCiphers = results.ciphers.filter(c => c.supported);

  // Protocol checks
  const hasInsecureProtocols = supportedProtocols.some(p => WEAK_PROTOCOLS.includes(p.protocol));
  const hasSecureProtocols = supportedProtocols.some(p => SECURE_PROTOCOLS.includes(p.protocol));
  
  if (hasInsecureProtocols) {
    recommendations.push({
      description: 'Disable support for older, insecure TLS/SSL protocols',
      details: 'Older protocols like TLS 1.0, TLS 1.1, and SSL are considered insecure and should be disabled.',
      severity: 'high',
    });
  }

  if (!hasSecureProtocols) {
    recommendations.push({
      description: 'Enable support for modern TLS protocols (TLS 1.2 or 1.3)',
      details: 'Modern protocols provide better security and performance.',
      severity: 'high',
    });
  }

  // Cipher suite checks
  const insecureCiphers = supportedCiphers.filter(c => !isSecureCipher(c.cipher));
  if (insecureCiphers.length > 0) {
    recommendations.push({
      description: `Disable ${insecureCiphers.length} weak cipher(s)`,
      details: 'Weak ciphers can be exploited by attackers to decrypt traffic.',
      severity: 'high',
    });
  }

  // Check for perfect forward secrecy
  const hasPFS = supportedCiphers.some(c => 
    c.cipher.includes('ECDHE') || c.cipher.includes('DHE')
  );
  
  if (!hasPFS) {
    recommendations.push({
      description: 'Enable Perfect Forward Secrecy (PFS)',
      details: 'PFS ensures that session keys are not compromised even if the private key is compromised.',
      severity: 'medium',
    });
  }

  // Check for weak key exchange
  const weakKeyExchange = supportedCiphers.some(c => 
    c.cipher.includes('_RSA_') && !c.cipher.includes('_ECDHE_RSA_')
  );
  
  if (weakKeyExchange) {
    recommendations.push({
      description: 'Use ECDHE key exchange instead of RSA key exchange',
      details: 'ECDHE provides forward secrecy which RSA key exchange does not.',
      severity: 'medium',
    });
  }

  // Check for weak hashes
  const weakHashes = supportedCiphers.some(c => 
    c.cipher.includes('_SHA') && !c.cipher.includes('_SHA256') && !c.cipher.includes('_SHA384')
  );
  
  if (weakHashes) {
    recommendations.push({
      description: 'Disable ciphers with weak hash algorithms (SHA1, MD5)',
      details: 'Weak hash algorithms can be exploited by attackers.',
      severity: 'high',
    });
  }

  // Check for TLS 1.3 support
  const hasTls13 = supportedProtocols.some(p => p.protocol === 'TLSv1.3');
  if (!hasTls13) {
    warnings.push('Consider enabling TLS 1.3 for improved security and performance.');
  }

  return { recommendations, warnings };
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
    const { domain, port = 443, tlsVersions, cipherSuites } = JSON.parse(event.body);
    
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

    const results = {
      domain,
      port: parseInt(port),
      timestamp: new Date().toISOString(),
      protocols: [],
      ciphers: [],
      recommendations: [],
      warnings: [],
    };

    // Test each protocol
    for (const protocol of tlsVersions || []) {
      try {
        const result = await testTlsConnection({
          host: domain,
          port: parseInt(port),
          rejectUnauthorized: false,
          servername: domain,
          minVersion: protocol,
          maxVersion: protocol,
        });

        results.protocols.push({
          protocol,
          supported: result.success,
          error: result.error,
          code: result.code,
        });
      } catch (error) {
        results.protocols.push({
          protocol,
          supported: false,
          error: error.message,
          code: error.code,
        });
      }
    }

    // Test each cipher suite with the best supported protocol
    const bestProtocol = results.protocols.find(p => p.supported)?.protocol || 'TLSv1.2';
    
    for (const cipher of cipherSuites || []) {
      try {
        const result = await testTlsConnection({
          host: domain,
          port: parseInt(port),
          rejectUnauthorized: false,
          servername: domain,
          minVersion: bestProtocol,
          maxVersion: bestProtocol,
          ciphers: cipher,
          honorCipherOrder: true,
        });

        results.ciphers.push({
          cipher,
          protocol: bestProtocol,
          supported: result.success,
          error: result.error,
          code: result.code,
          keySize: result.cipher?.standardName ? 
            parseInt(result.cipher.standardName.split('_').pop()) : null,
          isSecure: isSecureCipher(cipher),
        });
      } catch (error) {
        results.ciphers.push({
          cipher,
          protocol: bestProtocol,
          supported: false,
          error: error.message,
          code: error.code,
          isSecure: isSecureCipher(cipher),
        });
      }
    }

    // Generate recommendations
    const { recommendations, warnings } = generateRecommendations(results);
    results.recommendations = recommendations;
    results.warnings = warnings;

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while testing TLS configuration',
        details: error.message 
      }),
    };
  }
};

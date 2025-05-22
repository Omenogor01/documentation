const { promisify } = require('util');
const dns = require('dns');
const net = require('net');
const tls = require('tls');
const https = require('https');

// Promisify the dns.lookup function
const lookup = promisify(dns.lookup);

// Common services and their default ports
const COMMON_PORTS = [
  21, 22, 23, 25, 53, 80, 110, 115, 135, 139, 143, 194, 443, 445,
  587, 993, 995, 1433, 1521, 2049, 3306, 3389, 5432, 5900, 6379,
  8080, 8443, 27017, 27018, 27019
];

// Well-known services
const WELL_KNOWN_PORTS = {
  21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
  80: 'HTTP', 110: 'POP3', 115: 'SFTP', 135: 'MS RPC', 139: 'NetBIOS',
  143: 'IMAP', 194: 'IRC', 443: 'HTTPS', 445: 'SMB', 587: 'SMTP',
  993: 'IMAPS', 995: 'POP3S', 1433: 'MSSQL', 1521: 'Oracle', 2049: 'NFS',
  3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 5900: 'VNC', 6379: 'Redis',
  8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB', 27018: 'MongoDB Shard', 27019: 'MongoDB Config'
};

// Vulnerable ports and their risks
const VULNERABLE_PORTS = {
  21: { risk: 'high', description: 'FTP is insecure. Use SFTP or FTPS instead.' },
  23: { risk: 'critical', description: 'Telnet sends credentials in plaintext. Disable and use SSH instead.' },
  135: { risk: 'high', description: 'MS RPC can be exploited. Restrict access and apply security updates.' },
  139: { risk: 'high', description: 'NetBIOS can be used for enumeration. Disable if not needed.' },
  445: { risk: 'critical', description: 'SMB can be exploited (e.g., EternalBlue). Update and restrict access.' },
  1433: { risk: 'medium', description: 'MSSQL should be firewalled and use strong authentication.' },
  3389: { risk: 'high', description: 'RDP is often targeted by brute force attacks. Use VPN or restrict access.' },
  5900: { risk: 'medium', description: 'VNC may use weak authentication. Use SSH tunneling.' },
};

// Scan a single port
async function scanPort(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = 'closed';
    let protocol = 'tcp';
    let banner = '';
    let service = WELL_KNOWN_PORTS[port] || 'Unknown';

    // Set connection timeout
    socket.setTimeout(timeout);

    socket.on('connect', async () => {
      status = 'open';
      
      // Try to get banner if port is open
      try {
        // Special handling for HTTP/HTTPS
        if (port === 80 || port === 443 || port === 8080 || port === 8443) {
          const isHttps = port === 443 || port === 8443;
          const protocol = isHttps ? 'https' : 'http';
          
          try {
            const response = await new Promise((resolve, reject) => {
              const req = https.get(`${protocol}://${host}:${port}`, { 
                rejectUnauthorized: false,
                timeout: 2000 
              }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve({ 
                  statusCode: res.statusCode,
                  headers: res.headers,
                  data
                }));
              });
              
              req.on('error', reject);
              req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
              });
              
              setTimeout(() => {
                req.destroy();
                reject(new Error('Request timeout'));
              }, 2000);
            });
            
            banner = `HTTP/${response.statusCode} ${response.statusMessage || ''}`;
            if (response.headers.server) {
              banner += `\nServer: ${response.headers.server}`;
            }
          } catch (err) {
            // Ignore banner grabbing errors
          }
        } 
        // Special handling for SSH
        else if (port === 22) {
          try {
            const sshSocket = net.connect(port, host, () => {
              let sshBanner = '';
              sshSocket.once('data', (data) => {
                sshBanner = data.toString().trim();
                banner = sshBanner;
                sshSocket.destroy();
              });
            });
            
            sshSocket.setTimeout(2000, () => sshSocket.destroy());
            sshSocket.on('error', () => sshSocket.destroy());
          } catch (err) {
            // Ignore SSH banner errors
          }
        }
      } catch (err) {
        // Ignore banner grabbing errors
      }
      
      socket.destroy();
    });

    socket.on('timeout', () => {
      status = 'filtered';
      socket.destroy();
    });

    socket.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        status = 'closed';
      } else {
        status = 'filtered';
      }
      socket.destroy();
    });

    socket.on('close', () => {
      resolve({
        port,
        status,
        service,
        protocol,
        banner: banner || null,
        timestamp: new Date().toISOString()
      });
    });

    socket.connect(port, host);
  });
}

// Main handler function
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { host, ports = [], scanType = 'common' } = JSON.parse(event.body);
    
    if (!host) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Host is required' })
      };
    }

    // Resolve host to IP
    const ipAddress = await lookup(host).catch(() => ({}));
    
    if (!ipAddress || !ipAddress.address) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Could not resolve hostname' })
      };
    }

    // Determine which ports to scan
    let portsToScan = [];
    
    if (scanType === 'common') {
      portsToScan = COMMON_PORTS;
    } else if (scanType === 'range' && Array.isArray(ports) && ports.length > 0) {
      portsToScan = ports;
    } else if (scanType === 'quick') {
      // Scan top 1000 ports (simplified for demo)
      portsToScan = Array.from({ length: 1000 }, (_, i) => i + 1);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid scan type or port range' })
      };
    }

    // Limit the number of ports to scan for performance
    const MAX_PORTS = 100;
    if (portsToScan.length > MAX_PORTS) {
      portsToScan = portsToScan.slice(0, MAX_PORTS);
    }

    // Scan ports in parallel with a concurrency limit
    const CONCURRENCY_LIMIT = 10;
    const results = [];
    const startTime = Date.now();
    
    // Process ports in batches
    for (let i = 0; i < portsToScan.length; i += CONCURRENCY_LIMIT) {
      const batch = portsToScan.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(
        batch.map(port => scanPort(host, port))
      );
      results.push(...batchResults);
    }
    
    const scanDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Process results
    const openPorts = results.filter(r => r.status === 'open');
    const filteredPorts = results.filter(r => r.status === 'filtered');
    const closedPorts = results.filter(r => r.status === 'closed');
    
    // Generate security recommendations
    const recommendations = [];
    
    // Check for vulnerable ports
    openPorts.forEach(portResult => {
      if (VULNERABLE_PORTS[portResult.port]) {
        const vuln = VULNERABLE_PORTS[portResult.port];
        recommendations.push({
          port: portResult.port,
          title: `Vulnerable Service: ${portResult.service} (Port ${portResult.port})`,
          description: vuln.description,
          risk: vuln.risk,
          recommendation: `Consider disabling or securing port ${portResult.port} (${portResult.service})`
        });
      }
    });
    
    // Check for common security issues
    if (openPorts.some(p => [21, 23, 80, 443].includes(p.port))) {
      recommendations.push({
        title: 'Common Services Exposed',
        description: 'Common services like FTP, Telnet, HTTP, and HTTPS are exposed to the internet.',
        risk: 'medium',
        recommendation: 'Ensure these services are properly secured with strong authentication and encryption.'
      });
    }
    
    // Check for database ports
    const dbPorts = openPorts.filter(p => [1433, 1521, 27017, 3306, 5432].includes(p.port));
    if (dbPorts.length > 0) {
      recommendations.push({
        title: 'Database Ports Exposed',
        description: `Database ports (${dbPorts.map(p => p.port).join(', ')}) are exposed to the internet.`,
        risk: 'high',
        recommendation: 'Database servers should not be directly accessible from the internet. Use a VPN or SSH tunneling.'
      });
    }
    
    // Prepare response
    const response = {
      status: 'completed',
      host,
      ip: ipAddress.address,
      scanType,
      scanDuration,
      scannedPorts: results.length,
      openPorts: openPorts.length,
      filteredPorts: filteredPorts.length,
      closedPorts: closedPorts.length,
      scanResults: results,
      recommendations: recommendations.map(r => ({
        title: r.title,
        description: r.description,
        risk: r.risk,
        remediation: r.recommendation
      })),
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      })
    };
  }
};

// For local testing
if (require.main === module) {
  const test = async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        host: 'example.com',
        scanType: 'common'
      })
    };
    
    const result = await exports.handler(event, {});
    console.log(JSON.parse(result.body));
  };
  
  test().catch(console.error);
}
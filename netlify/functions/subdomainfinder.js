const dns = require('dns').promises;
const { Resolver } = require('dns');
const { promisify } = require('util');
const axios = require('axios');

// Common subdomains to check
const COMMON_SUBDOMAINS = [
  'www', 'mail', 'webmail', 'smtp', 'pop', 'imap', 'ftp', 'api', 'dev', 'test',
  'staging', 'mobile', 'm', 'secure', 'admin', 'portal', 'blog', 'shop', 'store',
  'app', 'apps', 'support', 'help', 'docs', 'wiki', 'status', 'dashboard', 'cpanel',
  'whm', 'webdisk', 'webdisk', 'ns1', 'ns2', 'dns1', 'dns2', 'vpn', 'remote',
  'intranet', 'extranet', 'internal', 'external', 'old', 'new', 'beta', 'alpha'
];

// DNS resolvers to use
const RESOLVERS = [
  '1.1.1.1', // Cloudflare
  '8.8.8.8', // Google
  '9.9.9.9', // Quad9
  '208.67.222.222' // OpenDNS
];

// Timeout for DNS lookups (in ms)
const DNS_TIMEOUT = 2000;

// Maximum number of concurrent DNS lookups
const MAX_CONCURRENT_LOOKUPS = 10;

// Cache for DNS lookups
const dnsCache = new Map();

/**
 * Check if a domain has DNS records
 * @param {string} domain - Domain to check
 * @returns {Promise<boolean>} - True if domain has DNS records
 */
async function hasDnsRecords(domain) {
  try {
    await dns.lookup(domain);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Resolve a domain to an IP address
 * @param {string} domain - Domain to resolve
 * @param {string} [resolver] - Optional DNS resolver to use
 * @returns {Promise<string|null>} - IP address or null if not found
 */
async function resolveDomain(domain, resolver) {
  if (dnsCache.has(domain)) {
    return dnsCache.get(domain);
  }

  const resolverInstance = new Resolver();
  if (resolver) {
    resolverInstance.setServers([resolver]);
  }

  try {
    const lookup = promisify(resolverInstance.resolve4.bind(resolverInstance));
    const addresses = await lookup(domain, { ttl: true });
    const result = addresses && addresses.length > 0 ? addresses[0] : null;
    dnsCache.set(domain, result);
    return result;
  } catch (error) {
    dnsCache.set(domain, null);
    return null;
  }
}

/**
 * Check if a subdomain exists
 * @param {string} subdomain - Subdomain to check
 * @param {string} domain - Base domain
 * @returns {Promise<Object>} - Object with subdomain info
 */
async function checkSubdomain(subdomain, domain) {
  const fullDomain = `${subdomain}.${domain}`;
  
  try {
    // Try to resolve the subdomain
    const ip = await resolveDomain(fullDomain);
    
    if (!ip) {
      return { subdomain, exists: false };
    }

    // Get additional DNS records if available
    const records = {
      A: [],
      AAAA: [],
      CNAME: [],
      MX: [],
      TXT: [],
    };

    try {
      const resolve = promisify(dns.resolve);
      
      // Get A records
      try {
        const aRecords = await resolve(fullDomain, 'A');
        records.A = aRecords;
      } catch (error) {
        // No A records
      }

      // Get AAAA records
      try {
        const aaaaRecords = await resolve(fullDomain, 'AAAA');
        records.AAAA = aaaaRecords;
      } catch (error) {
        // No AAAA records
      }

      // Get CNAME records
      try {
        const cnameRecords = await resolve(fullDomain, 'CNAME');
        records.CNAME = cnameRecords;
      } catch (error) {
        // No CNAME records
      }

      // Get MX records
      try {
        const mxRecords = await resolve(fullDomain, 'MX');
        records.MX = mxRecords;
      } catch (error) {
        // No MX records
      }

      // Get TXT records
      try {
        const txtRecords = await resolve(fullDomain, 'TXT');
        records.TXT = txtRecords;
      } catch (error) {
        // No TXT records
      }
    } catch (error) {
      console.error(`Error getting DNS records for ${fullDomain}:`, error);
    }

    return {
      subdomain,
      exists: true,
      ip,
      records
    };
  } catch (error) {
    return { subdomain, exists: false, error: error.message };
  }
}

/**
 * Get subdomains from various sources
 * @param {string} domain - Domain to find subdomains for
 * @returns {Promise<Array>} - Array of subdomains
 */
async function getSubdomains(domain) {
  const subdomains = new Set();
  
  // 1. Check common subdomains
  for (const sub of COMMON_SUBDOMAINS) {
    subdomains.add(sub);
  }

  // 2. Try to get subdomains from certificate transparency logs
  try {
    const response = await axios.get(`https://crt.sh/?q=%.${domain}&output=json`, {
      timeout: 5000
    });
    
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(entry => {
        if (entry.name_value) {
          const names = entry.name_value.split('\n');
          names.forEach(name => {
            if (name.endsWith(`.${domain}`)) {
              const sub = name.replace(`.${domain}`, '');
              subdomains.add(sub);
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching from crt.sh:', error.message);
  }

  // 3. Try to get subdomains from VirusTotal
  try {
    const vtApiKey = process.env.VIRUSTOTAL_API_KEY;
    if (vtApiKey) {
      const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}/subdomains`, {
        headers: { 'x-apikey': vtApiKey },
        timeout: 5000
      });
      
      if (response.data && response.data.data) {
        response.data.data.forEach(item => {
          if (item.id && item.id.endsWith(`.${domain}`)) {
            const sub = item.id.replace(`.${domain}`, '');
            subdomains.add(sub);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching from VirusTotal:', error.message);
  }

  return Array.from(subdomains);
}

/**
 * Process subdomains with concurrency control
 * @param {Array} subdomains - Array of subdomains to check
 * @param {string} domain - Base domain
 * @param {number} [concurrency=MAX_CONCURRENT_LOOKUPS] - Maximum concurrent lookups
 * @returns {Promise<Array>} - Array of results
 */
async function processSubdomains(subdomains, domain, concurrency = MAX_CONCURRENT_LOOKUPS) {
  const results = [];
  const queue = [...subdomains];
  
  async function worker() {
    while (queue.length > 0) {
      const subdomain = queue.pop();
      if (!subdomain) continue;
      
      try {
        const result = await checkSubdomain(subdomain, domain);
        results.push(result);
      } catch (error) {
        console.error(`Error checking subdomain ${subdomain}:`, error);
        results.push({ subdomain, exists: false, error: error.message });
      }
    }
  }
  
  // Start worker threads
  const workers = [];
  for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
    workers.push(worker());
  }
  
  // Wait for all workers to finish
  await Promise.all(workers);
  
  return results;
}

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
    const hasDns = await hasDnsRecords(domain);
    if (!hasDns) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain does not have valid DNS records' }),
      };
    }

    // Get potential subdomains
    const subdomains = await getSubdomains(domain);
    
    // Check which subdomains exist
    const results = await processSubdomains(subdomains, domain);
    
    // Filter out non-existent subdomains
    const existingSubdomains = results.filter(r => r.exists);
    
    // Sort alphabetically
    existingSubdomains.sort((a, b) => a.subdomain.localeCompare(b.subdomain));

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        timestamp: new Date().toISOString(),
        subdomains: existingSubdomains,
        totalFound: existingSubdomains.length,
        totalChecked: subdomains.length
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while finding subdomains',
        details: error.message 
      }),
    };
  }
};
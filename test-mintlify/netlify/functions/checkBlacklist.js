const dns = require('dns').promises;

// List of DNS-based blacklists to check
const BLACKLISTS = [
  { name: 'Spamhaus ZEN', host: '%s.zen.spamhaus.org' },
  { name: 'SURBL', host: '%s.multi.surbl.org' },
  { name: 'Barracuda', host: '%s.b.barracudacentral.org' },
  { name: 'SpamCop', host: '%s.bl.spamcop.net' },
  { name: 'SORBS', host: '%s.dnsbl.sorbs.net' },
];

// Cache for storing recent lookups
const lookupCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to check if a domain is blacklisted
async function checkBlacklist(domain, blacklist) {
  try {
    const lookupHost = blacklist.host.replace('%s', domain);
    await dns.lookup(lookupHost);
    return { name: blacklist.name, listed: true };
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return { name: blacklist.name, listed: false };
    }
    console.error(`Error checking ${blacklist.name}:`, err);
    return { name: blacklist.name, listed: false, error: err.message };
  }
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Get domain from query parameters
  const { domain } = event.queryStringParameters || {};
  if (!domain) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Domain parameter is required' }),
    };
  }

  // Check cache first
  const cacheKey = domain.toLowerCase();
  const cachedResult = lookupCache.get(cacheKey);
  
  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cachedResult.data),
    };
  }

  try {
    // Check all blacklists in parallel
    const results = await Promise.all(
      BLACKLISTS.map(blacklist => checkBlacklist(domain, blacklist))
    );

    // Calculate reputation score (0-100)
    const listedCount = results.filter(r => r.listed).length;
    const score = Math.max(0, 100 - (listedCount * 20));

    const response = {
      domain,
      isListed: listedCount > 0,
      blacklists: results,
      reputationScore: score,
      lastChecked: new Date().toISOString(),
    };

    // Cache the result
    lookupCache.set(cacheKey, {
      timestamp: Date.now(),
      data: response,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to check domain against blacklists',
        details: error.message 
      }),
    };
  }
};
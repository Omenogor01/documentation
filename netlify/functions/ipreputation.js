const { promisify } = require('util');
const dns = require('dns');
const https = require('https');
const { URL } = require('url');

// Promisify the dns.lookup function
const lookup = promisify(dns.lookup);

// Mock API keys - in production, these should be stored in environment variables
const API_KEYS = {
  virustotal: process.env.VIRUSTOTAL_API_KEY || 'YOUR_VIRUSTOTAL_API_KEY',
  abuseipdb: process.env.ABUSEIPDB_API_KEY || 'YOUR_ABUSEIPDB_API_KEY',
  ipqualityscore: process.env.IPQUALITYSCORE_API_KEY || 'YOUR_IPQUALITYSCORE_API_KEY',
  ipapi: process.env.IPAPI_API_KEY || 'YOUR_IPAPI_API_KEY'
};

// Cache for storing API responses (in-memory, resets on function restart)
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = res.statusCode === 200 ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: response
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Check IP reputation using multiple sources
async function checkIPReputation(ip) {
  const cacheKey = `ip:${ip}`;
  const cachedResult = cache.get(cacheKey);
  
  // Return cached result if available and not expired
  if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_TTL)) {
    return cachedResult.data;
  }
  
  // Check if the IP is private or reserved
  if (isPrivateIP(ip)) {
    return {
      ip,
      is_private: true,
      threat_level: 'low',
      confidence_score: 0,
      categories: ['private'],
      details: {
        private: {
          found: true,
          details: 'This is a private IP address',
          last_seen: new Date().toISOString()
        }
      },
      recommendations: [
        {
          title: 'Private IP Address',
          description: 'This is a private IP address (RFC 1918). Private IPs are not routable on the public internet.'
        }
      ]
    };
  }
  
  // Check IP against various threat intelligence sources
  const [vtResult, abuseResult, ipqsResult, ipapiResult] = await Promise.allSettled([
    checkVirusTotal(ip),
    checkAbuseIPDB(ip),
    checkIPQualityScore(ip),
    checkIPAPI(ip)
  ]);
  
  // Process results
  const details = {};
  const categories = new Set();
  let threatScore = 0;
  let totalWeight = 0;
  let isVpn = false;
  let isProxy = false;
  let isTor = false;
  let isMalicious = false;
  
  // Process VirusTotal results
  if (vtResult.status === 'fulfilled' && vtResult.value) {
    details.virustotal = vtResult.value;
    if (vtResult.value.malicious > 0) {
      threatScore += 70;
      totalWeight += 70;
      isMalicious = true;
      categories.add('malicious');
    }
  }
  
  // Process AbuseIPDB results
  if (abuseResult.status === 'fulfilled' && abuseResult.value) {
    details.abuseipdb = abuseResult.value;
    if (abuseResult.value.abuseConfidenceScore > 0) {
      const score = Math.min(abuseResult.value.abuseConfidenceScore, 100);
      threatScore += score * 0.8; // 80% weight
      totalWeight += 80;
      
      if (score > 70) {
        isMalicious = true;
        categories.add('malicious');
      }
    }
  }
  
  // Process IPQualityScore results
  if (ipqsResult.status === 'fulfilled' && ipqsResult.value) {
    details.ipqualityscore = ipqsResult.value;
    
    if (ipqsResult.value.vpn) {
      isVpn = true;
      categories.add('vpn');
    }
    
    if (ipqsResult.value.tor) {
      isTor = true;
      categories.add('tor');
    }
    
    if (ipqsResult.value.proxy) {
      isProxy = true;
      categories.add('proxy');
    }
    
    if (ipqsResult.value.fraud_score > 50) {
      const score = (ipqsResult.value.fraud_score - 50) * 0.5; // 0-25 weight
      threatScore += score;
      totalWeight += 25;
    }
  }
  
  // Process IP-API results
  if (ipapiResult.status === 'fulfilled' && ipapiResult.value) {
    details.ipapi = ipapiResult.value;
    
    // Check for hosting providers
    if (ipapiResult.value.hosting === true) {
      categories.add('hosting');
    }
  }
  
  // Calculate overall threat level
  const confidenceScore = totalWeight > 0 ? Math.min(Math.round((threatScore / totalWeight) * 100), 100) : 0;
  
  // Determine threat level
  let threatLevel = 'low';
  if (confidenceScore >= 70) {
    threatLevel = 'high';
  } else if (confidenceScore >= 30) {
    threatLevel = 'medium';
  }
  
  // Generate recommendations
  const recommendations = [];
  
  if (isMalicious) {
    recommendations.push({
      title: 'Malicious Activity Detected',
      description: 'This IP has been flagged for malicious activity. Exercise caution and consider blocking it.'
    });
  }
  
  if (isVpn || isProxy || isTor) {
    const services = [];
    if (isVpn) services.push('VPN');
    if (isProxy) services.push('proxy');
    if (isTor) services.push('TOR');
    
    recommendations.push({
      title: `${services.join('/')} Detected`,
      description: `This IP is associated with ${services.join(' or ')} services. ` +
        'This could indicate anonymous or suspicious activity.'
    });
  }
  
  // Prepare final result
  const result = {
    ip,
    is_private: false,
    threat_level: threatLevel,
    confidence_score: confidenceScore,
    categories: Array.from(categories),
    details,
    recommendations,
    timestamp: new Date().toISOString()
  };
  
  // Cache the result
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: result
  });
  
  return result;
}

// Check if an IP is private (RFC 1918)
function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  
  // 10.0.0.0 - 10.255.255.255
  if (parts[0] === 10) return true;
  
  // 172.16.0.0 - 172.31.255.255
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0 - 192.168.255.255
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // 127.0.0.0 - 127.255.255.255 (loopback)
  if (parts[0] === 127) return true;
  
  // 169.254.0.0 - 169.254.255.255 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  
  return false;
}

// Check IP against VirusTotal
async function checkVirusTotal(ip) {
  if (!API_KEYS.virustotal || API_KEYS.virustotal === 'YOUR_VIRUSTOTAL_API_KEY') {
    return null; // Skip if no API key
  }
  
  try {
    const url = new URL(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`);
    const response = await makeRequest(url, {
      method: 'GET',
      headers: {
        'x-apikey': API_KEYS.virustotal,
        'Accept': 'application/json'
      },
      timeout: 5000
    });
    
    if (response.statusCode === 200 && response.data) {
      const data = response.data.data || {};
      const attributes = data.attributes || {};
      const lastAnalysisResults = attributes.last_analysis_results || {};
      
      let malicious = 0;
      let total = 0;
      
      Object.values(lastAnalysisResults).forEach((result) => {
        total++;
        if (result.category === 'malicious' || result.category === 'suspicious') {
          malicious++;
        }
      });
      
      return {
        found: malicious > 0,
        malicious,
        total,
        last_analysis_date: attributes.last_analysis_date,
        as_owner: attributes.as_owner,
        country: attributes.country,
        last_modification_date: attributes.last_modification_date
      };
    }
  } catch (error) {
    console.error('VirusTotal API error:', error.message);
  }
  
  return null;
}

// Check IP against AbuseIPDB
async function checkAbuseIPDB(ip) {
  if (!API_KEYS.abuseipdb || API_KEYS.abuseipdb === 'YOUR_ABUSEIPDB_API_KEY') {
    return null; // Skip if no API key
  }
  
  try {
    const url = new URL('https://api.abuseipdb.com/api/v2/check');
    url.searchParams.append('ipAddress', ip);
    url.searchParams.append('maxAgeInDays', '90');
    
    const response = await makeRequest(url, {
      method: 'GET',
      headers: {
        'Key': API_KEYS.abuseipdb,
        'Accept': 'application/json'
      },
      timeout: 5000
    });
    
    if (response.statusCode === 200 && response.data) {
      const data = response.data.data || {};
      
      return {
        found: data.abuseConfidenceScore > 0,
        abuseConfidenceScore: data.abuseConfidenceScore || 0,
        totalReports: data.totalReports || 0,
        lastReportedAt: data.lastReportedAt,
        isp: data.isp,
        domain: data.domain,
        countryCode: data.countryCode,
        usageType: data.usageType
      };
    }
  } catch (error) {
    console.error('AbuseIPDB API error:', error.message);
  }
  
  return null;
}

// Check IP against IPQualityScore
async function checkIPQualityScore(ip) {
  if (!API_KEYS.ipqualityscore || API_KEYS.ipqualityscore === 'YOUR_IPQUALITYSCORE_API_KEY') {
    return null; // Skip if no API key
  }
  
  try {
    const url = new URL(`https://ipqualityscore.com/api/json/ip/${API_KEYS.ipqualityscore}/${ip}`);
    url.searchParams.append('strictness', '1');
    url.searchParams.append('allow_public_access_points', 'true');
    url.searchParams.append('fast', 'true');
    
    const response = await makeRequest(url, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.statusCode === 200 && response.data) {
      return {
        fraud_score: response.data.fraud_score || 0,
        vpn: response.data.vpn || false,
        proxy: response.data.proxy || false,
        tor: response.data.tor || false,
        active_vpn: response.data.active_vpn || false,
        active_tor: response.data.active_tor || false,
        recent_abuse: response.data.recent_abuse || false,
        bot_status: response.data.bot_status || false,
        is_crawler: response.data.is_crawler || false,
        connection_type: response.data.connection_type,
        isp: response.data.ISP,
        organization: response.data.organization,
        country_code: response.data.country_code,
        region: response.data.region,
        city: response.data.city
      };
    }
  } catch (error) {
    console.error('IPQualityScore API error:', error.message);
  }
  
  return null;
}

// Check IP against IP-API
async function checkIPAPI(ip) {
  try {
    const url = new URL(`http://ip-api.com/json/${ip}`);
    url.searchParams.append('fields', 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting,query');
    
    const response = await makeRequest(url, {
      method: 'GET',
      timeout: 3000
    });
    
    if (response.statusCode === 200 && response.data && response.data.status === 'success') {
      return {
        country: response.data.country,
        countryCode: response.data.countryCode,
        region: response.data.regionName,
        city: response.data.city,
        isp: response.data.isp,
        org: response.data.org,
        as: response.data.as,
        asname: response.data.asname,
        mobile: response.data.mobile || false,
        proxy: response.data.proxy || false,
        hosting: response.data.hosting || false,
        reverse: response.data.reverse
      };
    }
  } catch (error) {
    console.error('IP-API error:', error.message);
  }
  
  return null;
}

// Main handler function
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse request body
    const { ip } = JSON.parse(event.body);
    
    if (!ip) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'IP address is required' })
      };
    }
    
    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid IP address format' })
      };
    }
    
    // Check IP reputation
    const result = await checkIPReputation(ip);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
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
        ip: '8.8.8.8' // Test with Google's DNS
      })
    };
    
    const result = await exports.handler(event, {});
    console.log(JSON.parse(result.body));
  };
  
  test().catch(console.error);
}

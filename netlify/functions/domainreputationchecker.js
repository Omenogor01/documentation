const axios = require('axios');
const dns = require('dns');

// Reputation services
const REPUTATION_SERVICES = [
  'https://api.sucuri.net/v3/siteinfo',
  'https://api.threatcrowd.org/domain/report.json',
  'https://api.urlscan.io/v1/search/',
];

// Blacklist services
const BLACKLIST_SERVICES = [
  'zen.spamhaus.org',
  'bl.spamcop.net',
  'dnsbl.sorbs.net',
];

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Initialize results
    const results = {
      reputation: {
        score: 100,
        trust: 100,
        risk: 'low',
      },
      security: {
        ssl: false,
        sslDetails: '',
        malware: false,
        malwareDetails: '',
        phishing: false,
        phishingDetails: '',
      },
      blacklist: [],
      details: {
        age: 0,
        registrationDate: '',
        expirationDate: '',
        registrar: '',
      },
    };

    // Check reputation services
    for (const service of REPUTATION_SERVICES) {
      try {
        const response = await axios.get(service, {
          params: {
            domain,
            api_key: process.env[`${service.split('/')[2]}_API_KEY`],
          },
        });

        const data = response.data;
        
        // Update reputation score based on service results
        if (data.risk) {
          results.reputation.score = Math.min(results.reputation.score, data.risk.score);
        }
        if (data.trust) {
          results.reputation.trust = Math.min(results.reputation.trust, data.trust.score);
        }
        if (data.risk_level) {
          results.reputation.risk = data.risk_level;
        }
      } catch (error) {
        // Continue with other services if one fails
        console.error(`Error checking ${service}:`, error.message);
      }
    }

    // Check security
    try {
      const sslResponse = await axios.get(`https://api.ssllabs.com/api/v3/analyze`, {
        params: {
          host: domain,
          startNew: 'on',
          fromCache: 'on',
        },
      });

      const sslData = sslResponse.data;
      results.security.ssl = sslData.endpoints?.[0]?.grade !== 'F';
      results.security.sslDetails = sslData.endpoints?.[0]?.grade || 'No SSL';
    } catch (error) {
      console.error('SSL check error:', error.message);
    }

    // Check malware and phishing
    try {
      const threatResponse = await axios.get(`https://api.threatfox-api.abuse.ch/api/v1/`, {
        params: {
          query: 'domain',
          search_term: domain,
        },
      });

      const threatData = threatResponse.data;
      results.security.malware = threatData.data?.some(item => item.tag === 'malware');
      results.security.malwareDetails = results.security.malware ? 'Malware detected' : '';
      results.security.phishing = threatData.data?.some(item => item.tag === 'phishing');
      results.security.phishingDetails = results.security.phishing ? 'Phishing detected' : '';
    } catch (error) {
      console.error('Threat check error:', error.message);
    }

    // Check blacklists
    for (const blacklist of BLACKLIST_SERVICES) {
      try {
        const response = await axios.get(`https://dns.google/resolve`, {
          params: {
            name: `${domain}.${blacklist}`,
            type: 'A',
          },
        });

        if (response.data.Answer) {
          results.blacklist.push({
            name: blacklist,
            status: 'listed',
            reason: 'Found in blacklist',
          });
        } else {
          results.blacklist.push({
            name: blacklist,
            status: 'not listed',
            reason: 'Not found',
          });
        }
      } catch (error) {
        results.blacklist.push({
          name: blacklist,
          status: 'error',
          reason: error.message,
        });
      }
    }

    // Get domain details
    try {
      const whoisResponse = await axios.get('https://whois.whoisxmlapi.com/api/whois', {
        params: {
          domainName: domain,
          apiKey: process.env.WHOIS_API_KEY,
        },
      });

      const whoisData = whoisResponse.data;
      results.details.age = Math.floor(
        (new Date() - new Date(whoisData.createdDate)) / (1000 * 60 * 60 * 24 * 365)
      );
      results.details.registrationDate = whoisData.createdDate;
      results.details.expirationDate = whoisData.expirationDate;
      results.details.registrar = whoisData.registrarName;
    } catch (error) {
      console.error('WHOIS error:', error.message);
    }

    // Generate recommendations
    const recommendations = [];
    if (results.reputation.score < 75) {
      recommendations.push('Improve domain reputation');
    }
    if (results.security.ssl === false) {
      recommendations.push('Implement SSL/TLS');
    }
    if (results.security.malware || results.security.phishing) {
      recommendations.push('Clean up security issues');
    }
    if (results.blacklist.some(entry => entry.status === 'listed')) {
      recommendations.push('Contact blacklist maintainers');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        reputation: results.reputation,
        security: results.security,
        blacklist: results.blacklist,
        details: results.details,
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

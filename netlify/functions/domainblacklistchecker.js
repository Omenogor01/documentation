const dns = require('dns');
const axios = require('axios');

// Blacklist categories and their providers
const BLACKLISTS = {
  spam: [
    { name: 'Spamhaus', domain: 'zen.spamhaus.org' },
    { name: 'SpamCop', domain: 'bl.spamcop.net' },
    { name: 'SORBS', domain: 'dnsbl.sorbs.net' },
    { name: 'SpamRBL', domain: 'rbl.spamlab.com' },
  ],
  malware: [
    { name: 'Malware Domain List', domain: 'dbl.spamhaus.org' },
    { name: 'MalwarePatrol', domain: 'malwarepatrol.net' },
    { name: 'MalwareURL', domain: 'malwareurl.com' },
  ],
  phishing: [
    { name: 'PhishTank', domain: 'phishlabs.com' },
    { name: 'Anti-Phishing Working Group', domain: 'apwg.org' },
    { name: 'Google Safe Browsing', domain: 'safebrowsing.google.com' },
  ],
  security: [
    { name: 'Emerging Threats', domain: 'dnsbl.emergingthreats.net' },
    { name: 'Project Honey Pot', domain: 'dnsbl.httpbl.org' },
    { name: 'OpenBL', domain: 'openbl.org' },
  ],
};

// API endpoints for additional checks
const API_ENDPOINTS = {
  phishtank: 'https://checkurl.phishtank.com/checkurl/',
  google: 'https://safebrowsing.googleapis.com/v4/threatMatches:find',
  threatfox: 'https://threatfox-api.abuse.ch/api/v1/',
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
    // Initialize results
    const results = {
      spam: [],
      malware: [],
      phishing: [],
      security: [],
      totalBlacklists: 0,
      totalListings: 0,
      overallStatus: 'clean',
    };

    // Function to check DNS-based blacklists
    const checkDnsBlacklist = async (blacklist) => {
      try {
        const response = await axios.get('https://dns.google/resolve', {
          params: {
            name: `${domain}.${blacklist.domain}`,
            type: 'A',
          },
        });

        const status = response.data.Answer ? 'listed' : 'not listed';
        const reason = status === 'listed' ? 'Found in blacklist' : 'Not found';

        results.totalBlacklists++;
        if (status === 'listed') {
          results.totalListings++;
        }

        return {
          name: blacklist.name,
          status,
          reason,
        };
      } catch (error) {
        results.totalBlacklists++;
        return {
          name: blacklist.name,
          status: 'error',
          reason: error.message,
        };
      }
    };

    // Check all blacklists
    for (const [category, blacklists] of Object.entries(BLACKLISTS)) {
      for (const blacklist of blacklists) {
        const result = await checkDnsBlacklist(blacklist);
        results[category].push(result);
      }
    }

    // Check API-based blacklists
    try {
      // PhishTank check
      const phishtankResponse = await axios.post(API_ENDPOINTS.phishtank, {
        url: `http://${domain}`,
        format: 'json',
        app_key: process.env.PHISHTANK_API_KEY,
      });

      const phishtankResult = phishtankResponse.data;
      results.phishing.push({
        name: 'PhishTank API',
        status: phishtankResult.results?.in_database ? 'listed' : 'not listed',
        reason: phishtankResult.results?.in_database ? 'Phishing site' : 'Not a phishing site',
      });
    } catch (error) {
      console.error('PhishTank error:', error.message);
    }

    try {
      // Google Safe Browsing check
      const googleResponse = await axios.post(API_ENDPOINTS.google, {
        client: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientVersion: '1.0',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: `http://${domain}` }],
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
      });

      const googleResult = googleResponse.data;
      results.security.push({
        name: 'Google Safe Browsing',
        status: googleResult.matches?.length > 0 ? 'listed' : 'not listed',
        reason: googleResult.matches?.length > 0 ? 'Security threat detected' : 'No threats detected',
      });
    } catch (error) {
      console.error('Google Safe Browsing error:', error.message);
    }

    try {
      // ThreatFox check
      const threatfoxResponse = await axios.post(API_ENDPOINTS.threatfox, {
        query: 'domain',
        search_term: domain,
      });

      const threatfoxResult = threatfoxResponse.data;
      results.malware.push({
        name: 'ThreatFox',
        status: threatfoxResult.data?.length > 0 ? 'listed' : 'not listed',
        reason: threatfoxResult.data?.length > 0 ? 'Malware detected' : 'No malware detected',
      });
    } catch (error) {
      console.error('ThreatFox error:', error.message);
    }

    // Determine overall status
    if (results.totalListings > 0) {
      results.overallStatus = 'listed';
    }

    // Generate recommendations
    const recommendations = [];
    if (results.totalListings > 0) {
      recommendations.push('Contact blacklist maintainers');
      recommendations.push('Review domain security');
      recommendations.push('Implement security measures');
    }
    if (results.security.some(entry => entry.status === 'listed')) {
      recommendations.push('Enhance security protocols');
    }
    if (results.malware.some(entry => entry.status === 'listed')) {
      recommendations.push('Clean up malware');
    }
    if (results.phishing.some(entry => entry.status === 'listed')) {
      recommendations.push('Address phishing concerns');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        ...results,
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

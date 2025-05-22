const axios = require('axios');

// List of blacklist services to check
const BLACKLIST_SERVICES = [
  {
    name: 'Spamhaus ZEN',
    url: 'https://zen.spamhaus.org',
    type: 'dnsbl',
  },
  {
    name: 'Spamcop',
    url: 'https://bl.spamcop.net',
    type: 'dnsbl',
  },
  {
    name: 'SORBS',
    url: 'https://dnsbl.sorbs.net',
    type: 'dnsbl',
  },
  {
    name: 'Project Honey Pot',
    url: 'https://www.projecthoneypot.org',
    type: 'api',
    endpoint: '/api/v2/check',
  },
  {
    name: 'Abuse.ch',
    url: 'https://feodotracker.abuse.ch',
    type: 'api',
    endpoint: '/api/v2/query',
  },
];

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email address is required' }),
    };
  }

  try {
    const domain = email.split('@')[1];
    const results = [];
    let isBlacklisted = false;

    // Check each blacklist service
    for (const service of BLACKLIST_SERVICES) {
      try {
        let status = 'not listed';
        let reason = '';

        if (service.type === 'dnsbl') {
          // DNSBL check
          const dnsblDomain = `${domain}.${service.url}`;
          const response = await axios.get(`https://dns.google/resolve`, {
            params: {
              name: dnsblDomain,
              type: 'A',
            },
          });

          if (response.data.Answer) {
            status = 'listed';
            reason = 'Found in DNSBL';
            isBlacklisted = true;
          }
        } else if (service.type === 'api') {
          // API check
          const response = await axios.get(`${service.url}${service.endpoint}`, {
            params: {
              email,
              key: process.env[`${service.name}_API_KEY`],
            },
          });

          if (response.data.blacklisted) {
            status = 'listed';
            reason = response.data.reason || 'Blacklisted';
            isBlacklisted = true;
          }
        }

        results.push({
          name: service.name,
          status,
          reason,
        });
      } catch (error) {
        results.push({
          name: service.name,
          status: 'error',
          reason: error.message,
        });
      }
    }

    // Generate recommendations
    const recommendations = [];
    if (isBlacklisted) {
      recommendations.push('Review email sending practices');
      recommendations.push('Check email content for spam triggers');
      recommendations.push('Verify sender reputation');
      recommendations.push('Contact blacklist maintainers for removal');
    } else {
      recommendations.push('Email appears clean');
      recommendations.push('Continue monitoring');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        email,
        isBlacklisted,
        blacklists: results,
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

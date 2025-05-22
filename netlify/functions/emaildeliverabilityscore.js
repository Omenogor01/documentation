const dns = require('dns');
const axios = require('axios');

// Factors and their weightage
const FACTORS = {
  syntax: {
    weight: 10,
    check: async (email) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return {
        score: regex.test(email) ? 100 : 0,
        status: regex.test(email) ? 'good' : 'bad',
        details: regex.test(email) ? 'Valid email syntax' : 'Invalid email syntax',
      };
    }
  },
  domain: {
    weight: 15,
    check: async (domain) => {
      try {
        const mxRecords = await new Promise((resolve, reject) => {
          dns.resolveMx(domain, (err, records) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          });
        });

        return {
          score: mxRecords.length > 0 ? 100 : 0,
          status: mxRecords.length > 0 ? 'good' : 'bad',
          details: mxRecords.length > 0 ? 'Valid MX records' : 'No MX records found',
        };
      } catch (error) {
        return {
          score: 0,
          status: 'bad',
          details: 'Domain lookup failed',
        };
      }
    }
  },
  spf: {
    weight: 20,
    check: async (domain) => {
      try {
        const records = await new Promise((resolve, reject) => {
          dns.resolveTxt(domain, (err, records) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          });
        });

        const spfRecords = records.filter(record => record[0].startsWith('v=spf1'));
        return {
          score: spfRecords.length > 0 ? 100 : 0,
          status: spfRecords.length > 0 ? 'good' : 'warning',
          details: spfRecords.length > 0 ? 'SPF record found' : 'No SPF record found',
        };
      } catch (error) {
        return {
          score: 0,
          status: 'warning',
          details: 'SPF check failed',
        };
      }
    }
  },
  dkim: {
    weight: 20,
    check: async (domain) => {
      try {
        const selector = 'default';
        const dkimDomain = `_domainkey.${domain}`;
        const records = await new Promise((resolve, reject) => {
          dns.resolveTxt(dkimDomain, (err, records) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          });
        });

        const dkimRecords = records.filter(record => record[0].startsWith('v=DKIM1'));
        return {
          score: dkimRecords.length > 0 ? 100 : 0,
          status: dkimRecords.length > 0 ? 'good' : 'warning',
          details: dkimRecords.length > 0 ? 'DKIM record found' : 'No DKIM record found',
        };
      } catch (error) {
        return {
          score: 0,
          status: 'warning',
          details: 'DKIM check failed',
        };
      }
    }
  },
  dmarc: {
    weight: 15,
    check: async (domain) => {
      try {
        const dmarcDomain = `_dmarc.${domain}`;
        const records = await new Promise((resolve, reject) => {
          dns.resolveTxt(dmarcDomain, (err, records) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          });
        });

        const dmarcRecords = records.filter(record => record[0].startsWith('v=DMARC1'));
        return {
          score: dmarcRecords.length > 0 ? 100 : 0,
          status: dmarcRecords.length > 0 ? 'good' : 'warning',
          details: dmarcRecords.length > 0 ? 'DMARC record found' : 'No DMARC record found',
        };
      } catch (error) {
        return {
          score: 0,
          status: 'warning',
          details: 'DMARC check failed',
        };
      }
    }
  },
  blacklist: {
    weight: 10,
    check: async (domain) => {
      try {
        // Check against major blacklists
        const blacklists = ['zen.spamhaus.org', 'bl.spamcop.net'];
        let score = 100;
        let status = 'good';
        let details = 'Not listed in blacklists';

        for (const blacklist of blacklists) {
          const response = await axios.get(`https://dns.google/resolve`, {
            params: {
              name: `${domain}.${blacklist}`,
              type: 'A',
            },
          });

          if (response.data.Answer) {
            score = 0;
            status = 'bad';
            details = `Listed in ${blacklist}`;
            break;
          }
        }

        return {
          score,
          status,
          details,
        };
      } catch (error) {
        return {
          score: 0,
          status: 'warning',
          details: 'Blacklist check failed',
        };
      }
    }
  },
  reputation: {
    weight: 10,
    check: async (domain) => {
      try {
        // Check domain reputation
        const response = await axios.get('https://api.sendgrid.com/v3/suppression/bounces', {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          params: {
            limit: 1,
            domain: domain,
          },
        });

        const score = response.data.length > 0 ? 50 : 100;
        const status = score === 100 ? 'good' : 'warning';
        const details = score === 100 ? 'Good reputation' : 'Some bounces detected';

        return {
          score,
          status,
          details,
        };
      } catch (error) {
        return {
          score: 75,
          status: 'warning',
          details: 'Reputation check failed',
        };
      }
    }
  },
};

exports.handler = async (event) => {
  const { email, domain } = JSON.parse(event.body);

  if (!email || !domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email and domain are required' }),
    };
  }

  try {
    // Calculate scores for all factors
    const factors = {};
    let totalScore = 0;
    let totalWeight = 0;

    for (const [factor, config] of Object.entries(FACTORS)) {
      const result = await config.check(domain);
      factors[factor] = result;
      totalScore += result.score * (config.weight / 100);
      totalWeight += config.weight;
    }

    // Generate recommendations
    const recommendations = [];
    Object.entries(factors).forEach(([factor, info]) => {
      if (info.status !== 'good') {
        recommendations.push(`Improve ${factor.toUpperCase()} configuration`);
      }
    });

    // Determine overall status
    let overallStatus = 'good';
    let overallMessage = '';

    if (totalScore < 50) {
      overallStatus = 'bad';
      overallMessage = 'Poor deliverability - Multiple issues detected';
    } else if (totalScore < 75) {
      overallStatus = 'warning';
      overallMessage = 'Moderate deliverability - Some improvements needed';
    } else {
      overallStatus = 'good';
      overallMessage = 'Good deliverability - No major issues detected';
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        email,
        domain,
        score: Math.round(totalScore),
        factors,
        recommendations,
        overallStatus,
        overallMessage,
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

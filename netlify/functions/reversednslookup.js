const dns = require('dns');
const net = require('net');
const axios = require('axios');

exports.handler = async (event) => {
  const { ip } = JSON.parse(event.body);

  if (!ip) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'IP address is required' }),
    };
  }

  try {
    // Initialize results
    const results = {
      ip,
      domainName: '',
      ptrRecord: '',
      status: 'pending',
      details: {
        ipVersion: '',
        ipClass: '',
        networkRange: '',
      },
      validation: {
        ipValid: false,
        dnsValid: false,
        ptrValid: false,
        recommendations: [],
      },
    };

    // Validate IP address
    results.validation.ipValid = net.isIPv4(ip) || net.isIPv6(ip);
    results.details.ipVersion = net.isIPv4(ip) ? 'IPv4' : net.isIPv6(ip) ? 'IPv6' : 'Unknown';

    if (!results.validation.ipValid) {
      results.validation.recommendations.push('Please enter a valid IP address');
      results.status = 'error';
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...results,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Perform reverse DNS lookup
    try {
      const ptrRecords = await new Promise((resolve, reject) => {
        dns.resolvePtr(ip, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });

      if (ptrRecords && ptrRecords.length > 0) {
        results.domainName = ptrRecords[0];
        results.ptrRecord = ptrRecords[0];
        results.validation.ptrValid = true;
      }
    } catch (error) {
      console.error('PTR lookup error:', error.message);
    }

    // Get additional IP details
    try {
      const ipInfoResponse = await axios.get('https://ipinfo.io/json', {
        params: {
          ip,
        },
      });

      const ipInfo = ipInfoResponse.data;
      results.details.ipClass = ipInfo.org;
      results.details.networkRange = `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`;
    } catch (error) {
      console.error('IP info error:', error.message);
    }

    // Validate DNS records
    try {
      const dnsRecords = await new Promise((resolve, reject) => {
        dns.resolve(ip, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });

      if (dnsRecords && dnsRecords.length > 0) {
        results.validation.dnsValid = true;
      }
    } catch (error) {
      console.error('DNS validation error:', error.message);
    }

    // Determine final status
    results.status = results.validation.ptrValid && results.validation.dnsValid
      ? 'success'
      : 'warning';

    // Generate recommendations
    if (!results.validation.ptrValid) {
      results.validation.recommendations.push('Configure PTR record for IP');
    }
    if (!results.validation.dnsValid) {
      results.validation.recommendations.push('Verify DNS records');
    }
    if (results.status === 'warning') {
      results.validation.recommendations.push('Check DNS configuration');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...results,
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

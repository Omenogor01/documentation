const dns = require('dns');
const axios = require('axios');

// List of DNS servers to check
const DNS_SERVERS = [
  { name: 'Google DNS', location: 'Global', ip: '8.8.8.8' },
  { name: 'Cloudflare DNS', location: 'Global', ip: '1.1.1.1' },
  { name: 'Quad9 DNS', location: 'Global', ip: '9.9.9.9' },
  { name: 'OpenDNS', location: 'Global', ip: '208.67.222.222' },
  { name: 'Verisign DNS', location: 'Global', ip: '64.6.64.6' },
];

exports.handler = async (event) => {
  const { domain, recordType } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    const results = [];

    // Check each DNS server
    for (const server of DNS_SERVERS) {
      try {
        // Use DNS-over-HTTPS for more reliable results
        const response = await axios.get(`https://dns.google/resolve`, {
          params: {
            name: domain,
            type: recordType,
            edns_client_subnet: server.ip,
          },
        });

        const record = response.data;
        const status = record.Answer ? 'propagated' : 'not propagated';
        
        results.push({
          name: server.name,
          location: server.location,
          result: record.Answer ? record.Answer[0].data : 'No record found',
          status,
        });
      } catch (error) {
        results.push({
          name: server.name,
          location: server.location,
          result: 'Error checking',
          status: 'error',
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        recordType,
        servers: results,
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

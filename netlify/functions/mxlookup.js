const dns = require('dns');
const axios = require('axios');

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get MX records
    const mxRecords = await new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    // Sort records by priority
    mxRecords.sort((a, b) => a.priority - b.priority);

    // Check each mail server
    const servers = await Promise.all(
      mxRecords.map(async (record) => {
        try {
          // Check if mail server is responding
          const response = await axios.get(`https://${record.exchange}/health`);
          const status = response.status === 200 ? 'active' : 'inactive';

          // Get additional details
          const details = [];
          
          // Check TLS support
          try {
            const tls = await axios.get(`https://${record.exchange}/.well-known/tls-cert`);
            details.push('TLS supported');
          } catch {
            details.push('No TLS support');
          }

          // Check SPF support
          const txtRecords = await new Promise((resolve, reject) => {
            dns.resolveTxt(record.exchange, (err, records) => {
              if (err) {
                reject(err);
              } else {
                resolve(records);
              }
            });
          });

          const hasSPF = txtRecords.some(record => record.join('').startsWith('v=spf1'));
          details.push(hasSPF ? 'SPF supported' : 'No SPF support');

          return {
            exchange: record.exchange,
            priority: record.priority,
            status,
            details,
          };
        } catch (error) {
          return {
            exchange: record.exchange,
            priority: record.priority,
            status: 'error',
            details: [error.message],
          };
        }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        servers,
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

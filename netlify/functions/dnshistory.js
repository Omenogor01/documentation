const dns = require('dns');
const axios = require('axios');

// API endpoint for DNS history (using a public DNS history service)
const DNS_HISTORY_API = 'https://dns-history-api.example.com';

exports.handler = async (event) => {
  const { domain, recordType } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get current DNS record
    const currentRecord = await new Promise((resolve, reject) => {
      dns.resolve(domain, recordType, (err, addresses) => {
        if (err) {
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });

    // Get historical records from API
    const response = await axios.get(`${DNS_HISTORY_API}/history`, {
      params: {
        domain,
        type: recordType,
      },
    });

    const history = response.data.map((entry) => {
      const changes = [];
      if (entry.previous) {
        // Compare with previous record
        if (entry.value !== entry.previous) {
          changes.push(`Changed from ${entry.previous} to ${entry.value}`);
        }
      }

      return {
        date: entry.date,
        value: entry.value,
        status: entry.status,
        changes,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        recordType,
        history,
        currentRecord,
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

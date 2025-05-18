const dns = require('dns');

exports.handler = async (event) => {
  const { domain, recordType } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    const results = await new Promise((resolve, reject) => {
      dns.resolve(domain, recordType, (err, addresses) => {
        if (err) {
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        recordType,
        results,
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

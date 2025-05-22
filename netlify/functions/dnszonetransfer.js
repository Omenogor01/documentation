const dns = require('dns');
const net = require('net');

exports.handler = async (event) => {
  const { domain } = JSON.parse(event.body);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' }),
    };
  }

  try {
    // Get name servers
    const nameServers = await new Promise((resolve, reject) => {
      dns.resolveNs(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });

    // Check zone transfer for each name server
    const results = [];
    const records = [];

    for (const server of nameServers) {
      try {
        // Attempt zone transfer
        const socket = new net.Socket();
        const query = dns.makeQuery(dns.QUESTION, [
          {
            name: domain,
            type: dns.TSIG,
          },
        ]);

        socket.connect(53, server, () => {
          socket.write(query);
        });

        socket.on('data', (data) => {
          try {
            const response = dns.parseMessage(data);
            results.push({
              name: server,
              status: 'allowed',
              records: response.answers,
            });
            response.answers.forEach(answer => {
              records.push({
                type: dns.type(answer.type),
                host: answer.name,
                value: answer.data,
                ttl: answer.ttl,
              });
            });
          } catch (err) {
            results.push({
              name: server,
              status: 'blocked',
              error: err.message,
            });
          }
        });

        socket.on('error', (err) => {
          results.push({
            name: server,
            status: 'error',
            error: err.message,
          });
        });
      } catch (err) {
        results.push({
          name: server,
          status: 'error',
          error: err.message,
        });
      }
    }

    // Generate security recommendations
    const recommendations = [];
    if (results.some(r => r.status === 'allowed')) {
      recommendations.push('Enable zone transfer restrictions');
      recommendations.push('Implement DNSSEC');
      recommendations.push('Configure proper ACLs');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
        status: results.some(r => r.status === 'allowed') ? 'allowed' : 'blocked',
        nameServers,
        records,
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

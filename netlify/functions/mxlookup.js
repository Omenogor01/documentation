const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const domain = (event.queryStringParameters && event.queryStringParameters.domain) || '';
  if (!domain.match(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid domain.' })
    };
  }
  try {
    // Using Cloudflare DNS over HTTPS API
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`;
    const resp = await fetch(url, {
      headers: {
        'accept': 'application/dns-json'
      }
    });
    const data = await resp.json();
    if (!data.Answer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ mx: [] })
      };
    }
    // Parse MX records
    const mx = data.Answer.filter(r => r.type === 15).map(r => {
      const [priority, ...exchange] = r.data.split(' ');
      return { priority, exchange: exchange.join(' ') };
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ mx })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch MX records.' })
    };
  }
};

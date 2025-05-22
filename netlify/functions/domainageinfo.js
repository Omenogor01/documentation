const axios = require('axios');
const moment = require('moment');

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
      age: {
        total: 0,
        creationDate: '',
        expirationDate: '',
        renewalStatus: 'unknown',
      },
      registration: {
        registrar: '',
        registrant: '',
        status: '',
        registrarStatus: 'unknown',
        registrantStatus: 'unknown',
      },
      history: [],
      analysis: {
        ageAnalysis: '',
        registrationStability: '',
        renewalPattern: '',
        recommendations: [],
      },
    };

    // Get WHOIS information
    try {
      const whoisResponse = await axios.get('https://whois.whoisxmlapi.com/api/whois', {
        params: {
          domainName: domain,
          apiKey: process.env.WHOIS_API_KEY,
        },
      });

      const whoisData = whoisResponse.data;

      // Update age information
      results.age.creationDate = whoisData.createdDate;
      results.age.expirationDate = whoisData.expirationDate;
      results.age.total = Math.floor(
        (new Date() - new Date(whoisData.createdDate)) / (1000 * 60 * 60 * 24 * 365)
      );
      
      // Update registration information
      results.registration.registrar = whoisData.registrarName;
      results.registration.registrant = whoisData.registrantName;
      results.registration.status = whoisData.status;
      
      // Update status indicators
      results.registration.registrarStatus = whoisData.registrarName ? 'active' : 'inactive';
      results.registration.registrantStatus = whoisData.registrantName ? 'active' : 'inactive';
      results.age.renewalStatus = whoisData.expirationDate ? 'active' : 'expired';
    } catch (error) {
      console.error('WHOIS error:', error.message);
    }

    // Get historical information
    try {
      const historyResponse = await axios.get('https://api.whoisxmlapi.com/api/whoisHistory', {
        params: {
          domainName: domain,
          apiKey: process.env.WHOIS_API_KEY,
        },
      });

      const historyData = historyResponse.data;
      results.history = historyData.map(entry => ({
        date: entry.date,
        type: entry.type,
        details: entry.details,
      }));
    } catch (error) {
      console.error('History error:', error.message);
    }

    // Analyze domain information
    results.analysis.ageAnalysis = results.age.total >= 2 
      ? 'Established domain with good history'
      : 'Newer domain, may need additional verification';

    results.analysis.registrationStability = results.history.length > 0 
      ? 'Multiple registration changes detected'
      : 'Stable registration history';

    results.analysis.renewalPattern = results.age.renewalStatus === 'active' 
      ? 'Active renewal pattern'
      : 'Renewal issues detected';

    // Generate recommendations
    if (results.age.total < 1) {
      results.analysis.recommendations.push('Consider domain age for trustworthiness');
    }
    if (results.registration.registrarStatus !== 'active') {
      results.analysis.recommendations.push('Verify registrar information');
    }
    if (results.registration.registrantStatus !== 'active') {
      results.analysis.recommendations.push('Verify registrant information');
    }
    if (results.age.renewalStatus !== 'active') {
      results.analysis.recommendations.push('Check domain renewal status');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        domain,
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

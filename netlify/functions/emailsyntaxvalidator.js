const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email address is required' }),
    };
  }

  try {
    // Basic validation
    const isValid = emailRegex.test(email);
    const parts = email.split('@');
    const localPart = parts[0];
    const domainPart = parts[1];

    // Detailed validation
    const details = {
      localPart: {
        valid: isValid,
        message: isValid ? 'Valid local part' : 'Invalid local part format'
      },
      domainPart: {
        valid: isValid,
        message: isValid ? 'Valid domain part' : 'Invalid domain format'
      },
      length: {
        valid: email.length <= 254,
        message: email.length <= 254 ? 'Length is within limit' : 'Email too long (max 254 chars)'
      },
      specialChars: {
        valid: !/[<>\[\](){}|\\]/.test(email),
        message: !/[<>\[\](){}|\\]/.test(email) ? 'No special characters' : 'Contains special characters'
      },
      consecutiveDots: {
        valid: !localPart.includes('..'),
        message: !localPart.includes('..') ? 'No consecutive dots' : 'Contains consecutive dots'
      },
      leadingTrailingDots: {
        valid: !localPart.startsWith('.') && !localPart.endsWith('.'),
        message: !localPart.startsWith('.') && !localPart.endsWith('.') ? 'No leading/trailing dots' : 'Contains leading/trailing dots'
      },
      domainFormat: {
        valid: domainPart.split('.').every(part => part.length > 0),
        message: domainPart.split('.').every(part => part.length > 0) ? 'Valid domain format' : 'Invalid domain format'
      }
    };

    // Generate issues list
    const issues = [];
    Object.values(details).forEach(detail => {
      if (!detail.valid) {
        issues.push(detail.message);
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        email,
        isValid,
        details,
        issues,
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

import React, { useState } from 'react';
import { Input, Button, Alert, Badge, Card, LoadingSpinner } from './ui';

export const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const validateEmail = (email) => {
    // Comprehensive email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    setSuggestion('');
    setIsValid(null);
    setIsCopied(false);

    // Simulate API call
    setTimeout(() => {
      const valid = validateEmail(email);
      setIsValid(valid);
      
      // Generate a suggestion for invalid emails
      if (!valid) {
        if (email.includes('@')) {
          const [user, domain] = email.split('@');
          if (domain) {
            const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
            const similarDomain = commonDomains.find(d => 
              d.includes(domain) || domain.includes(d.split('.')[0])
            );
            
            if (similarDomain) {
              setSuggestion(`Did you mean ${user}@${similarDomain}?`);
            } else if (!domain.includes('.')) {
              setSuggestion(`The domain "${domain}" appears to be missing a TLD (e.g., .com, .org)`);
            }
          } else {
            setSuggestion('Email address is missing a domain (e.g., example.com)');
          }
        } else {
          setSuggestion('Email address is missing the @ symbol');
        }
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Email Validator</h2>
          <p className="text-gray-600">
            Enter an email address to validate its format and get suggestions for common issues.
          </p>
        </div>

        <form onSubmit={checkEmail} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Validating...' : 'Validate'}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && isValid !== null && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Result:</h3>
              <Badge variant={isValid ? 'success' : 'error'}>
                {isValid ? 'Valid Email' : 'Invalid Email'}
              </Badge>
            </div>

            {isValid ? (
              <Alert variant="success">
                <p>The email address <span className="font-mono">{email}</span> appears to be valid.</p>
              </Alert>
            ) : (
              <Alert variant="error">
                <p>The email address <span className="font-mono">{email}</span> appears to be invalid.</p>
                {suggestion && <p className="mt-2">{suggestion}</p>}
              </Alert>
            )}

            {suggestion && suggestion.includes('Did you mean') && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Suggested correction:</p>
                <div className="flex items-center justify-between bg-white p-3 rounded border">
                  <code className="text-blue-600">{suggestion.replace('Did you mean ', '')}</code>
                  <Button 
                    onClick={() => {
                      const suggestedEmail = suggestion.replace('Did you mean ', '').replace('?', '');
                      setEmail(suggestedEmail);
                      copyToClipboard(suggestedEmail);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmailValidator;

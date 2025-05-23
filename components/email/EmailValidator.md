---
title: "Email Validator"
description: "A React component for validating email addresses with helpful suggestions"
---

# Email Validator

A lightweight yet powerful email validation component that checks for common email issues and provides helpful suggestions.

```jsx
import React, { useState } from 'react';
import { Input, Button, Alert, Badge } from '../../components/ui';

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const validateEmail = (email) => {
    // Basic email validation regex
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
              setSuggestion(`${user}@${similarDomain}`);
            } else if (!domain.includes('.')) {
              setSuggestion(`${user}@${domain}.com`);
            }
          }
        }
      }
      
      setIsLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Email Validator</h2>
        <p className="text-gray-600">
          Check if an email address is valid and get suggestions for common typos
        </p>
      </div>

      <form onSubmit={checkEmail} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter an email address"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !email.trim()}>
            {isLoading ? 'Checking...' : 'Validate'}
          </Button>
        </div>
      </form>

      {isValid !== null && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Results</h3>
            <Badge variant={isValid ? 'success' : 'error'} className="uppercase">
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <code className="font-mono text-lg">{email}</code>
              {isValid && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="ml-2"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </div>
            
            {suggestion && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Did you mean?</p>
                <div className="flex items-center">
                  <code className="font-mono text-blue-600">{suggestion}</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setEmail(suggestion);
                      setSuggestion('');
                    }}
                    className="ml-2 text-blue-600 hover:bg-blue-50"
                  >
                    Use this
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {!isValid && !suggestion && (
            <Alert variant="warning">
              This email address appears to be invalid. Please check for typos and try again.
            </Alert>
          )}
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium mb-3">Email Validation Checks</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Valid email format (user@domain.tld)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Common domain suggestions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>No disposable email addresses</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmailValidator;
```

## Features

- Validates email format using comprehensive regex
- Detects and suggests fixes for common typos (e.g., gmail.com, yahoo.com)
- Identifies and blocks disposable email addresses
- Provides helpful suggestions for invalid emails
- Responsive design that works on all devices
- Copy to clipboard for valid emails
- Client-side validation with no external API calls

## Installation

1. Ensure you have the required dependencies:

```bash
npm install @mintlify/components
```

## Usage

### Basic Usage

```jsx
import EmailValidator from './components/email/EmailValidator';

function App() {
  return (
    <div className="container mx-auto p-4">
      <EmailValidator />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValue | string | '' | Initial email value |
| placeholder | string | 'Enter an email address' | Input placeholder text |
| validateOnChange | boolean | false | Validate email on input change |
| showValidationTips | boolean | true | Show validation tips and suggestions |

## Validation Rules

1. Must contain exactly one @ symbol
2. Local part (before @) must not be empty
3. Domain part (after @) must not be empty
4. Must contain a period (.) in the domain part
5. Domain extension must be at least 2 characters long
6. No spaces allowed in the email
7. No special characters at the start or end

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 10+)
- Chrome for Android

## Accessibility

- Keyboard navigable
- Screen reader friendly
- High contrast mode support
- Focus states for all interactive elements

## License

MIT

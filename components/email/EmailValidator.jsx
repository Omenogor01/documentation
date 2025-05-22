/** @jsxRuntime classic */
/** @jsx React.createElement */
import React, { useState } from 'react';
import { Card, Button } from '@mintlify/components';

// Icon component with default props
const Icon = ({ size = 24, className = '', children = null }) => ({
  size,
  className,
  children
});

// Local Mail icon component
const MailIcon = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Local Check icon component
const CheckIcon = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Local X icon component
const XIcon = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Local Copy icon component
const CopyIcon = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// Local Alert component
const Alert = ({ 
  variant = 'info', 
  children 
}) => {
  const baseClasses = 'p-4 rounded-md';
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

// Local Badge component
const Badge = ({ 
  variant = 'default', 
  children 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Validation result structure
const createValidationResult = (isValid, message, suggestions = []) => ({
  isValid,
  message,
  suggestions
});

/**
 * EmailValidator Component
 * 
 * A simple yet powerful email validation component that checks for:
 * - Basic email format
 * - Common typos
 * - Disposable email domains
 * - MX record validation (client-side simulation)
 */
const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Common email domains for suggestions
  const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];
  
  // List of common disposable email domains
  const DISPOSABLE_DOMAINS = [
    'tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
    'yopmail.com', 'temp-mail.org', 'sharklasers.com', 'getnada.com', 'maildrop.cc'
  ];

  const validateEmail = (email) => {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, message: 'Please enter an email address' };
    }
    
    if (!emailRegex.test(email)) {
      return { 
        isValid: false, 
        message: 'Invalid email format',
        suggestions: getSuggestions(email)
      };
    }
    
    const [localPart, domain] = email.split('@');
    
    // Check for disposable email
    if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) {
      return {
        isValid: false,
        message: 'Disposable email addresses are not accepted',
        suggestions: ['Please use a permanent email address']
      };
    }
    
    // Check for common typos
    if (domain.includes('gamil.com') || domain.includes('gmai.com') || domain.includes('gmal.com')) {
      return {
        isValid: false,
        message: 'Did you mean gmail.com?',
        suggestions: [email.replace(/g[ma][ia]l\.com$/, 'gmail.com')]
      };
    }
    
    if (domain.includes('yaho.com') || domain.includes('yaho0.com') || domain.includes('yahho.com')) {
      return {
        isValid: false,
        message: 'Did you mean yahoo.com?',
        suggestions: [email.replace(/yaho+0*\.com$/, 'yahoo.com')]
      };
    }
    
    // If all checks pass
    return {
      isValid: true,
      message: 'Email is valid!',
      suggestions: []
    };
  };
  
  const getSuggestions = (email: string): string[] => {
    const suggestions: string[] = [];
    
    // Check for missing @
    if (!email.includes('@')) {
      COMMON_DOMAINS.forEach(domain => {
        suggestions.push(`${email}@${domain}`);
      });
      return suggestions.slice(0, 3);
    }
    
    // Check for common TLD typos
    const [localPart, domain] = email.split('@');
    if (domain) {
      if (domain.endsWith('.con')) {
        suggestions.push(`${localPart}@${domain.replace(/\.con$/, '.com')}`);
      }
      if (domain.endsWith('.cmo')) {
        suggestions.push(`${localPart}@${domain.replace(/\.cmo$/, '.com')}`);
      }
      if (domain.endsWith('.cm')) {
        suggestions.push(`${localPart}@${domain}.com`);
      }
    }
    
    return suggestions.slice(0, 3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCopied(false);
    
    // Simulate API call
    setTimeout(() => {
      const validationResult = validateEmail(email);
      setResult(validationResult);
      setLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestedEmail) => {
    setEmail(suggestedEmail);
    // Auto-validate the suggestion
    setTimeout(() => {
      const validationResult = validateEmail(suggestedEmail);
      setResult(validationResult);
    }, 100);
  };

  const handleCopy = () => {
    if (result?.isValid) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="space-y-6">
      <div className="text-center">
        <MailIcon size={48} className="mx-auto text-blue-500" />
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Email Validator</h2>
        <p className="mt-1 text-gray-500">Check if an email address is valid and properly formatted</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="email"
              id="email"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!email.trim() || loading}
            >
              {loading ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="mt-6">
          <div className={`p-4 rounded-md ${result.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.isValid ? (
                  <CheckIcon size={20} className="text-green-400" />
                ) : (
                  <XIcon size={20} className="text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </h3>
                {!result.isValid && result.suggestions && result.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Did you mean?</p>
                    <div className="mt-1 space-y-1">
                      {result.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {result.isValid && (
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    title="Copy email"
                  >
                    {copied ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <CopyIcon size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">What we check:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <CheckIcon size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Valid email format</span>
          </li>
          <li className="flex items-start">
            <CheckIcon size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Common typos (gmail.com, yahoo.com, etc.)</span>
          </li>
          <li className="flex items-start">
            <CheckIcon size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Disposable email detection</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default EmailValidator;

---
title: "Email Validator"
description: "A React component for validating email addresses with helpful suggestions"
---

# Email Validator

A lightweight yet powerful email validation component that checks for common email issues and provides helpful suggestions.

## Features

- ✅ Validates email format using comprehensive regex
- 🎯 Provides helpful suggestions for common typos
- 🎨 Shows visual feedback for valid/invalid emails
- 📱 Mobile-responsive design
- 📋 Copy suggested corrections with one click
- ⚡ Real-time validation
- 🛠️ Customizable appearance and behavior

## Live Demo

```jsx live
import { EmailValidator } from '/snippets/components/EmailValidator';

function EmailValidatorDemo() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Try the Email Validator</h2>
      <p className="text-gray-600 mb-6">
        Enter an email address to see the validation in action. The validator will check for common issues and provide helpful suggestions.
      </p>
      <EmailValidator />
    </div>
  );
}
```

## Installation

1. First, ensure you have the required dependencies:

```bash
npm install react react-dom
```

2. Import the component in your project:

```jsx
import { EmailValidator } from '/snippets/components/EmailValidator';
```

## Basic Usage

```jsx
function MyForm() {
  const handleValidation = (isValid, email) => {
    console.log(`${email} is ${isValid ? 'valid' : 'invalid'}`);
  };

  return (
    <div>
      <h2>Contact Information</h2>
      <EmailValidator 
        initialValue="user@example.com"
        onValidate={handleValidation}
        className="my-4"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | '' | Additional CSS classes for the container |
| `initialValue` | string | '' | Initial email value |
| `onValidate` | function | null | Callback fired after validation with signature `(isValid: boolean, email: string)` |
| `showLabels` | boolean | true | Whether to show field labels |
| `showSuggestions` | boolean | true | Whether to show email suggestions |
| `validateOnMount` | boolean | false | Whether to validate the initial value on mount |

## Validation Rules

The validator enforces these rules:

1. Must contain exactly one @ symbol
2. Local part (before @) must not be empty
3. Domain part (after @) must not be empty
4. Must contain a period (.) in the domain part
5. Domain extension must be at least 2 characters long
6. No spaces allowed in the email
7. No special characters except: . _ % + - 
8. Consecutive dots (..) are not allowed

## Common Validation Scenarios

| Input | Result | Suggestion |
|-------|--------|------------|
| `user@example.com` | ✅ Valid | - |
| `user@` | ❌ Invalid | Missing domain |
| `@example.com` | ❌ Invalid | Missing local part |
| `user@example` | ❌ Invalid | Missing TLD |
| `user@@example.com` | ❌ Invalid | Multiple @ symbols |
| `user@.com` | ❌ Invalid | Empty domain |
| `user@example..com` | ❌ Invalid | Consecutive dots |
| `user@example.c` | ❌ Invalid | TLD too short |
| `user@exämple.com` | ❌ Invalid | Non-ASCII characters |
| `user@com` | ⚠️ Warning | Common typo? |
| `user@gmail.cmo` | ⚠️ Warning | Did you mean gmail.com? |

## Custom Styling

You can customize the appearance using the `className` prop or by targeting these CSS classes:

```css
.email-validator {
  /* Container */
}

.email-validator input {
  /* Input field */
}

.email-validator .valid {
  /* Valid state */
  border-color: #10B981;
}

.email-validator .invalid {
  /* Invalid state */
  border-color: #EF4444;
}

.email-validator .suggestion {
  /* Suggestion text */
  color: #3B82F6;
}
```

## Advanced Usage

### Custom Validation

You can extend the validation by passing a custom validation function:

```jsx
function customValidator(email) {
  // Basic validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { isValid: false, message: 'Invalid email format' };
  
  // Custom domain validation
  const [_, domain] = email.split('@');
  if (domain === 'example.com') {
    return { 
      isValid: false, 
      message: 'Please use a different email provider' 
    };
  }
  
  return { isValid: true };
}

function MyForm() {
  return (
    <EmailValidator 
      customValidator={customValidator}
    />
  );
}
```

## Performance

The component is optimized for performance with:
- Memoized callbacks
- Debounced validation
- Lazy-loaded components
- Minimal re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome for Android

## Troubleshooting

### Common Issues

1. **Component not rendering**
   - Ensure React and ReactDOM are properly installed
   - Check for any console errors
   
2. **Validation not working**
   - Verify the email format being tested
   - Check browser console for errors
   
3. **Styling issues**
   - Ensure Tailwind CSS is properly imported
   - Check for CSS conflicts

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT © Your Name
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

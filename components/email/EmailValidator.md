---
title: "Email Validator"
description: "A React component for validating email addresses with helpful suggestions"
---

# Email Validator

A lightweight yet powerful email validation component that checks for common email issues and provides helpful suggestions. The component is built with React and styled with Tailwind CSS.

## Features

- ✅ Validates email format using comprehensive regex
- 🔍 Detects and suggests fixes for common typos (e.g., gmail.com, yahoo.com)
- 🚫 Identifies and blocks disposable email addresses
- 💡 Provides helpful suggestions for invalid emails
- 📱 Responsive design that works on all devices
- 📋 Copy to clipboard for valid emails
- ⚡ Client-side validation with no external API calls

## Installation

1. First, ensure you have the required dependencies:

```bash
npm install @mintlify/components
```

2. Copy the `EmailValidator.jsx` file to your components directory.

## Usage

### Basic Usage

```jsx
import EmailValidator from './components/email/EmailValidator';

function App() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <EmailValidator />
    </div>
  );
}

export default App;
```

### With Custom Styling

```jsx
<EmailValidator 
  className="bg-white p-6 rounded-lg shadow-md"
/>
```

## How It Works

The EmailValidator component performs several checks to validate an email address:

1. **Format Validation**: Ensures the email follows a valid format (e.g., user@example.com)
2. **Common Typos Detection**: Identifies and suggests fixes for common domain typos
3. **Disposable Email Check**: Blocks known disposable email domains
4. **Suggestions**: Provides helpful suggestions for invalid emails

## Validation Rules

The validator checks for the following:

1. **Basic Email Format**
   - Must contain exactly one @ symbol
   - Must have a valid domain part (e.g., example.com)
   - Must have a valid local part (before @)
   - Must not contain spaces

2. **Common Typos**
   - Detects and suggests fixes for common domain typos:
     - gmail.com (fixes gamil.com, gmial.com, etc.)
     - yahoo.com (fixes yaho.com, yahooo.com, etc.)
     - outlook.com (fixes outllok.com, outook.com, etc.)

3. **Disposable Email Domains**
   - Blocks known disposable/temporary email services
   - Prevents signups from temporary email providers

4. **Domain Validation**
   - Checks for valid top-level domains (TLDs)
   - Verifies domain structure

## Examples

### Valid Emails

```
user@example.com
firstname.lastname@domain.co.uk
user+tag@example.org
```

### Invalid Emails

```
plainaddress
@missingusername.com
user@.com
user@domain
user@domain.
user name@domain.com
user@domain@domain.com
```

## Error Messages

The component provides helpful error messages for various validation failures:

- **Invalid email format**: "Please enter a valid email address"
- **Disposable email**: "Disposable email addresses are not accepted"
- **Common typo detected**: "Did you mean gmail.com?"
- **Missing @ symbol**: "Email address must contain @ symbol"
- **Invalid domain**: "Please enter a valid domain name"

## Styling

The component uses Tailwind CSS for styling. You can customize the appearance by passing custom class names:

```jsx
<EmailValidator 
  className="bg-gray-50 p-6 rounded-xl border border-gray-200"
  inputClassName="border-2 border-blue-200 focus:border-blue-500"
  buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium"
/>
```

## Localization

To change the text strings used in the component, you can pass a `messages` prop:

```jsx
<EmailValidator
  messages={{
    placeholder: 'Enter your email',
    validateButton: 'Check Email',
    validMessage: 'Email is valid!',
    copyButton: 'Copy Email',
    copiedMessage: 'Email copied!',
    invalidFormat: 'Please enter a valid email address',
    disposableEmail: 'Disposable email addresses are not accepted',
    commonTypo: 'Did you mean {{suggestion}}?',
  }}
/>
```

## Browser Support

The component works in all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome for Android

## Accessibility

The component includes proper ARIA attributes and keyboard navigation:
- All form controls have proper labels
- Error messages are associated with form controls
- Keyboard navigation works as expected
- Color contrast meets WCAG 2.1 AA standards

## Performance

The validation is performed client-side with no external API calls, ensuring:
- Fast validation response times
- No network latency
- Works offline after initial page load
- Minimal bundle size impact

## Troubleshooting

### Common Issues

1. **Validation not working**
   - Ensure you've included the required dependencies
   - Check the browser console for any JavaScript errors
   - Verify that the email input is not being cleared by form submission

2. **Styling issues**
   - Make sure Tailwind CSS is properly imported in your project
   - Check for CSS conflicts with other stylesheets

3. **Copy to clipboard not working**
   - The feature requires a secure context (HTTPS or localhost)
   - Some browsers may block clipboard access in certain contexts

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT


## Examples

### With Initial Value

```tsx
<EmailValidator initialValue="user@example.com" />
```

### With Validation Callback

```tsx
const handleValidation = (result) => {
  console.log('Validation result:', result);
  // Handle validation result
};

<EmailValidator onValidate={handleValidation} />
```

## Custom Styling

You can customize the appearance using the `className` prop:

```tsx
<EmailValidator className="border-2 border-blue-200 rounded-lg p-6" />
```

## Accessibility

The component includes proper ARIA attributes and keyboard navigation:

- Focus management for better keyboard navigation
- ARIA live regions for screen readers
- High contrast colors for better visibility

## Related Components

- [EmailListTools](./EmailListTools) - A suite of email management tools
- [ContactForm](../forms/ContactForm) - A contact form with email validation

## License

MIT

---
title: "Email Deliverability Toolkit"
description: "A comprehensive set of tools to check and improve email deliverability"
---

# Email Deliverability Toolkit

A powerful React component that provides a suite of email deliverability tools to help you ensure your emails reach the inbox. This toolkit includes DNS record checking, email authentication validation, blacklist monitoring, domain reputation analysis, and email header analysis.

## Features

- **DNS Record Checker**: View and validate MX, SPF, DKIM, and DMARC records
- **Email Authentication Validator**: Verify SPF, DKIM, and DMARC configurations
- **Blacklist Checker**: Check if your domain is listed on major email blacklists
- **Domain Reputation**: Analyze your domain's email sending reputation
- **Header Analyzer**: Inspect and analyze email headers for deliverability issues
- **Responsive Design**: Works on all device sizes
- **Real-time Validation**: Immediate feedback on email deliverability status

## Installation

```bash
npm install @mintlify/components
```

## Usage

```jsx
import EmailDeliverabilityChecker from './components/email/EmailDeliverabilityChecker';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1>Email Deliverability Toolkit</h1>
      <EmailDeliverabilityChecker />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialDomain` | string | `''` | Pre-fill the domain input field |
| `onCheckStart` | function | `() => {}` | Callback when a check starts |
| `onCheckComplete` | function | `() => {}` | Callback when a check completes |
| `onError` | function | `() => {}` | Callback when an error occurs |
| `className` | string | `''` | Additional CSS classes for the container |

## Examples

### Basic Usage

```jsx
<EmailDeliverabilityChecker 
  initialDomain="example.com"
  onCheckStart={() => console.log('Checking...')}
  onCheckComplete={(results) => console.log('Results:', results)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Custom Styling

```jsx
<EmailDeliverabilityChecker 
  className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow"
  initialDomain="yourdomain.com"
/>
```

## API Integration

For production use, you'll need to implement the following API endpoints:

### 1. Check DNS Records

```
GET /api/email/dns-check?domain=example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mx": {
      "valid": true,
      "value": "mx1.example.com"
    },
    "spf": {
      "valid": true,
      "value": "v=spf1 include:_spf.google.com ~all"
    },
    "dkim": {
      "valid": true,
      "value": "k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAA..."
    },
    "dmarc": {
      "valid": true,
      "value": "v=DMARC1; p=none; rua=mailto:postmaster@example.com"
    }
  }
}
```

### 2. Check Blacklist Status

```
GET /api/email/blacklist-check?domain=example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "listed": false,
    "services": [
      { "name": "Spamhaus", "listed": false },
      { "name": "Barracuda", "listed": false },
      { "name": "SORBS", "listed": false }
    ]
  }
}
```

## Best Practices

1. **Regular Monitoring**
   - Check your domain's deliverability at least monthly
   - Set up alerts for blacklist status changes
   - Monitor authentication failures

2. **Maintain Good Sender Reputation**
   - Keep your email list clean
   - Use double opt-in for new subscribers
   - Monitor bounce and complaint rates

3. **Authentication Setup**
   - Always use SPF, DKIM, and DMARC
   - Keep DNS records updated
   - Use a consistent "From" domain

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify DNS records are properly configured
   - Check for syntax errors in SPF/DKIM records
   - Ensure proper alignment in DMARC policies

2. **Blacklist Issues**
   - If blacklisted, follow the delisting process for that service
   - Identify and resolve the cause of blacklisting
   - Monitor for future issues

3. **Poor Deliverability**
   - Check spam complaint rates
   - Review email content and sending practices
   - Verify list quality and engagement

## Browser Support

The component works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The component includes:
- Keyboard navigation
- ARIA attributes
- Color contrast compliance
- Screen reader support

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Changelog

### v1.0.0 (2025-05-22)
- Initial release of Email Deliverability Toolkit
- Added DNS record checking
- Added email authentication validation
- Added blacklist monitoring
- Added domain reputation analysis
- Added email header analyzer

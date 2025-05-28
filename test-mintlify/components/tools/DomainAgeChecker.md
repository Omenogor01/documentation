# Domain Age Checker

A powerful tool to check the age and registration details of any domain name. This component provides comprehensive information about domain registration, including creation date, last update, expiration date, and registrar information.

## Features

- 🔍 Check domain registration details
- 📅 View creation and expiration dates
- 🔄 Track last update information
- 📱 Fully responsive design
- ⚡ Fast and efficient

## Installation

1. Ensure the component is in your snippets directory:
   ```
   /snippets/components/tools/DomainAgeChecker.jsx
   ```

2. Import the component in your MDX file:
   ```jsx
   import { DomainAgeChecker } from '/snippets/components/tools/DomainAgeChecker';
   ```

## Basic Usage

```jsx live
<DomainAgeChecker />
```

## How It Works

The Domain Age Checker simulates a WHOIS lookup to provide domain registration information. In a production environment, you would typically connect this to a domain information API or your own backend service.

## Customization

### Props

The component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialDomain` | string | `''` | Pre-filled domain value |
| `className` | string | `''` | Additional CSS class |
| `onCheck` | function | `null` | Callback when a domain check is performed |

### Styling

You can customize the appearance using these CSS classes:

- `.domain-age-checker` - Main container
- `.input-group` - Wrapper for the input and button
- `.result` - Results container
- `.result-item` - Individual result row
- `.result-label` - Label text
- `.result-value` - Value text
- `.loading` - Loading state
- `.error` - Error message

## Example with Custom Styling

```jsx live
<div style={{ maxWidth: '800px', margin: '0 auto' }}>
  <h2>Check Domain Age</h2>
  <p>Enter a domain name to check its registration details:</p>
  <DomainAgeChecker 
    initialDomain="example.com"
    onCheck={(domain) => console.log('Checking domain:', domain)}
  />
</div>
```

## Integration with APIs

To connect to a real WHOIS or domain information API, you would typically:

1. Create an API endpoint in your backend
2. Update the `checkDomainAge` function to make a real API call
3. Parse and format the response

Example API integration (pseudo-code):

```javascript
const checkDomainAge = async (domain) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`);
    const data = await response.json();
    setAge(data);
  } catch (error) {
    setError('Failed to fetch domain information');
  } finally {
    setLoading(false);
  }
};
```

## Error Handling

The component includes basic error handling for:

- Empty domain submissions
- Network errors
- Invalid domain formats (basic validation)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Accessibility

The component includes:

- Proper ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
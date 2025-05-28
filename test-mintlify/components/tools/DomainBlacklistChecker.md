# Domain Blacklist Checker

A comprehensive tool to check if a domain is listed in major email blacklists. This component helps identify potential email deliverability issues by checking against well-known DNS-based blacklists (DNSBLs) and other reputation services.

## Features

- 🔍 Check domain against multiple blacklists
- 📊 View reputation score
- 🚦 Color-coded status indicators
- 📱 Fully responsive design
- ⚡ Real-time results

## Installation

1. Place the component in your snippets directory:
   ```
   /snippets/components/tools/DomainBlacklistChecker.jsx
   ```

2. Import the component in your MDX file:
   ```jsx
   import { DomainBlacklistChecker } from '/snippets/components/tools/DomainBlacklistChecker';
   ```

## Basic Usage

```jsx live
<DomainBlacklistChecker />
```

## How It Works

The Domain Blacklist Checker simulates checking a domain against multiple DNS-based blacklists. In a production environment, this would make actual DNS lookups to check if the domain is listed in various blacklists.

## Customization

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialDomain` | string | `''` | Pre-filled domain value |
| `className` | string | `''` | Additional CSS class |
| `onCheck` | function | `null` | Callback when a domain check is performed |

### Styling

Customize the appearance using these CSS classes:

- `.domain-blacklist-checker` - Main container
- `.input-group` - Wrapper for the input and button
- `.result` - Results container
- `.blacklist-item` - Individual blacklist result row
- `.status-badge` - Status indicator (clean/listed)
- `.reputation-score` - Score display
- `.loading` - Loading state
- `.error` - Error message

## Example with Custom Styling

```jsx live
<div style={{ maxWidth: '800px', margin: '0 auto' }}>
  <h2>Check Domain Reputation</h2>
  <p>Enter a domain to check its blacklist status:</p>
  <DomainBlacklistChecker 
    initialDomain="example.com"
    onCheck={(domain) => console.log('Checking domain:', domain)}
  />
</div>
```

## Integration with APIs

To connect to real blacklist checking services, you would typically:

1. Set up API credentials with blacklist providers
2. Create backend endpoints to handle the checks
3. Update the component to make authenticated requests

Example API integration (pseudo-code):

```javascript
const checkBlacklist = async (domain) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/blacklist-check?domain=${encodeURIComponent(domain)}`);
    const data = await response.json();
    setResults(data);
  } catch (error) {
    setError('Failed to check domain against blacklists');
  } finally {
    setLoading(false);
  }
};
```

## Error Handling

The component handles various error cases:

- Empty domain submissions
- Network errors
- Invalid domain formats
- API rate limiting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Accessibility

- Keyboard navigable
- Screen reader friendly
- High contrast mode support
- ARIA attributes for interactive elements

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

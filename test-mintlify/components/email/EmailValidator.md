# Email Validator Component

A robust email validation component that provides real-time feedback on email format validity.

## Features

- 🚀 Real-time email validation
- ✅ Visual feedback for valid/invalid states
- 🎨 Responsive design
- 🔍 Simple integration
- 🛡️ Client-side validation

## Installation

1. Ensure you have the component in your snippets directory:
   ```
   /snippets/components/email/EmailValidator.jsx
   ```

2. Import the component in your MDX file:
   ```jsx
   import { EmailValidator } from '/snippets/components/email/EmailValidator';
   ```

## Basic Usage

```jsx live
<EmailValidator />
```

## Customization

### Styling

The component includes basic styling, but you can customize it by overriding the CSS classes:

- `.email-validator` - Main container
- `.input-group` - Wrapper for the input field
- `.valid` - Applied when email is valid
- `.invalid` - Applied when email is invalid

### Props

The component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | string | `''` | Initial email value |
| `placeholder` | string | `'Enter email address'` | Input placeholder text |
| `className` | string | `''` | Additional CSS class |

## Example with Custom Styling

```jsx live
<div style={{ maxWidth: '400px', margin: '0 auto' }}>
  <h3>Subscribe to our newsletter</h3>
  <EmailValidator 
    placeholder="your.email@example.com"
  />
  <button 
    style={{
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer'
    }}
  >
    Subscribe
  </button>
</div>
```

## Validation Rules

The component validates emails using the following rules:

1. Must contain exactly one `@` symbol
2. Must have a valid domain part (after @)
3. Must have a valid top-level domain (after last .)
4. No spaces allowed
5. No special characters at the beginning or end

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 10+)
- Chrome for Android

## Troubleshooting

If the component isn't working as expected:

1. Check the browser's console for errors
2. Verify the component path is correct
3. Ensure React is properly loaded
4. Check for any CSS conflicts

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome!

## License

MIT

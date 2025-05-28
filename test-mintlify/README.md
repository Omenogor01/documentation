# Mintlify Documentation with Domain Tools

This is a documentation site built with Mintlify, featuring interactive domain tools including:

- Email Validator
- Domain Age Checker
- Domain Blacklist Checker

## Features

- 📝 Beautiful, responsive documentation
- ⚡ Interactive components
- 🔍 Domain tools with real-time validation
- 🚀 Deployable to Netlify
- 🔄 Real-time preview during development

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Netlify CLI (optional, for local development with functions)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/test-mintlify.git
   cd test-mintlify
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The site will be available at http://localhost:3001

### Building for Production

```bash
npm run build
# or
yarn build
```

### Previewing the Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
.
├── components/          # MDX components
│   ├── email/
│   └── tools/
├── netlify/
│   └── functions/      # Serverless functions
├── public/              # Static assets
│   ├── favicon.ico
│   ├── logo-light.svg
│   └── logo-dark.svg
├── snippets/            # React components
│   └── components/
├── mint.json            # Mintlify configuration
├── netlify.toml         # Netlify configuration
└── package.json
```

## Deploying to Netlify

1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Set up the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site

## Customizing

### Adding a New Page

1. Create a new `.md` or `.mdx` file in the appropriate directory under `components/`
2. Add the page to the navigation in `mint.json`

### Adding a New Component

1. Create a new React component in `snippets/components/`
2. Import and use it in your MDX files

## License

MIT

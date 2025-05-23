---
title: "Installation"
description: "How to install and set up the documentation"
---

# Installation

Follow these steps to get the documentation up and running on your local machine.

## Prerequisites

- Node.js 14.x or later
- npm 6.x or later

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/documentation.git
   cd documentation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

If you encounter any issues during installation, try the following:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

Previous: [Introduction](/introduction) | Next: [Configuration](/configuration)

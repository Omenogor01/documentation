---
title: "Configuration"
description: "How to configure the documentation"
---

# Configuration

This guide explains how to configure the documentation to suit your needs.

## Basic Configuration

All configuration is done in the `mint.json` file in the root of your project. Here are the main options:

```json
{
  "mint": {
    "name": "Your Documentation",
    "logo": {
      "light": "/logo-light.svg",
      "dark": "/logo-dark.svg"
    },
    "favicon": "/favicon.ico",
    "colors": {
      "primary": "#00b4d8",
      "light": "#90e0ef",
      "dark": "#0077b6",
      "ultralight": "#caf0f8"
    }
  }
}
```

## Navigation

Configure the navigation structure in the `navigation` section of `mint.json`:

```json
"navigation": {
  "header": [
    {
      "group": "Getting Started",
      "pages": [
        "introduction",
        "installation",
        "configuration"
      ]
    },
    {
      "group": "Tools",
      "pages": [
        {
          "group": "Email Tools",
          "pages": [
            "components/email/EmailValidator"
          ]
        },
        {
          "group": "Network Tools",
          "pages": [
            "components/tools/PortScanner",
            "components/tools/IPReputationChecker"
          ]
        }
      ]
    }
  ]
}
```

## Customization

### Colors

Customize the color scheme by modifying the `colors` object in `mint.json`:

```json
"colors": {
  "primary": "#00b4d8",
  "light": "#90e0ef",
  "dark": "#0077b6",
  "ultralight": "#caf0f8"
}
```

### Analytics

To enable Google Analytics, add your tracking ID:

```json
"googleAnalytics": "UA-XXXXXXXXX-X"
```

## Environment Variables

You can use environment variables in your configuration by prefixing them with `MINT_`:

```json
"apiUrl": "${MINT_API_URL}"
```

---

Previous: [Installation](/installation)

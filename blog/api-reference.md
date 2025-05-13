---
title: "API Reference & Useful Endpoints"
date: 2025-05-13
summary: "A quick reference for common email, DNS, and deliverability APIs and endpoints."
description: "Explore essential APIs and endpoints for diagnostics, validation, and automation in email and DNS workflows."
tags:
  - api
  - reference
  - endpoints
  - email
  - dns
image: /blog-logo.png
---

# API Reference & Useful Endpoints

This page lists common APIs and endpoints to help automate, validate, and monitor email and DNS workflows.

---

## Email & DNS APIs

### MXToolbox API
- [API Docs](https://mxtoolbox.com/developer/)
- Use for DNS lookups, blacklist checks, and SMTP diagnostics.

### ZeroBounce API
- [API Docs](https://zerobounce.net/docs/)
- Email validation and scoring.

### SendGrid API
- [API Docs](https://docs.sendgrid.com/)
- Transactional email sending, analytics, and deliverability monitoring.

### Postmark API
- [API Docs](https://postmarkapp.com/developer)
- Transactional email, inbound processing, and delivery analytics.

### DMARC Analyzer API
- [API Docs](https://support.dmarcanalyzer.com/hc/en-us/articles/360020148419-API-Documentation)
- DMARC reporting and analysis.

---

## Example: DNS Lookup (MXToolbox)
```http
GET https://api.mxtoolbox.com/api/v1/lookup/mx/example.com
Headers: { "Authorization": "Bearer YOUR_API_KEY" }
```

---

Have a favorite API to suggest? [Contact us](contact.md) or see our [contributing guide](contributing.md)!

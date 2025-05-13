---
title: "DKIM Record Template"
date: 2025-05-13
summary: "A ready-to-use DKIM DNS record template for email authentication."
description: "Copy and customize this DKIM record template to implement DKIM for your domain and improve email security."
tags:
  - dkim
  - template
  - dns
  - authentication
image: /blog-logo.png
---

# DKIM Record Template

Below is an example DKIM DNS record. Replace `selector1`, `example.com`, and `YOUR_PUBLIC_KEY` with your actual values.

```dns
selector1._domainkey.example.com. IN TXT "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"
```

---

*Learn more about DKIM in [Understanding DKIM: How Digital Signatures Protect Your Email](understanding-dkim.md) and see more templates in [Tools & Templates](../tools-and-templates.md).*

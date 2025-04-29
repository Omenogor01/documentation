---
title: "Top DNS Lookup Tools for Email Administrators"
date: "2024-04-05"
author: 
  name: "Alex Martinez"
  role: "Network Administrator"
  avatar: "/assets/images/authors/alex-martinez.jpg"
tags: ["tools", "dns", "lookup"]
---

## Recommended Tools

<ResourceList
  resources={[
    {
      title: "dig",
      description: "Command-line DNS lookup utility",
      link: "https://linux.die.net/man/1/dig"
    },
    {
      title: "MXToolbox",
      description: "Web-based DNS diagnostics",
      link: "https://mxtoolbox.com"
    },
    {
      title: "DNS Spy",
      description: "DNS monitoring service",
      link: "https://dnsspy.io"
    }
  ]}
/>

## dig Command Examples

```bash
# Check MX records
dig example.com MX +short

# Verify SPF record
dig example.com TXT | grep spf

# Validate DKIM selector
dig selector._domainkey.example.com TXT
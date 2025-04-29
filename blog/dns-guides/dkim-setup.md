---
title: "Complete DKIM Setup Guide: Signing Emails Properly"
date: "2024-05-10"
author: 
  name: "Samuel Omenz"
  role: "Email Security Engineer"
  avatar: "/assets/images/authors/samuel-omenz.jpg"
tags: ["dns", "dkim", "authentication"]
---

import { Steps, CardGroup, Card, CodeBlock } from '../../components/blog/Components'

## DKIM Implementation Walkthrough

<Steps>
  <Step title="Key Generation">
    ```bash
    # Generate private key
    openssl genrsa -out dkim.private 2048
    
    # Extract public key
    openssl rsa -in dkim.private -pubout -out dkim.public
    ```
  </Step>

  <Step title="DNS Configuration">
    ```dns
    ; Selector: default._domainkey
    default._domainkey.example.com. IN TXT 
    "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0Jct..."
    ```
  </Step>

  <Step title="Server Integration">
    ```postfix
    # Postfix main.cf
    milter_default_action = accept
    milter_protocol = 2
    smtpd_milters = inet:localhost:8891
    non_smtpd_milters = inet:localhost:8891
    ```
  </Step>
</Steps>

## Key Rotation Schedule

<CardGroup cols={3}>
  <Card title="Standard">
    2048-bit RSA  
    Rotate every 90 days
  </Card>
  
  <Card title="High Security">
    4096-bit RSA  
    Rotate every 30 days
  </Card>
  
  <Card title="Experimental">
    ED25519  
    Rotate every 7 days
  </Card>
</CardGroup>

## Troubleshooting Table

| Issue                 | Diagnostic Command              | Solution                     |
|-----------------------|---------------------------------|------------------------------|
| Missing DNS Record    | `dig +short txt default._domainkey` | Verify DNS propagation       |
| Signature Mismatch    | `opendkim-testkey -d example.com`   | Check private key alignment  |
| Expired Key           | `opendkim-testkey -v`               | Rotate keys immediately      |

<ResourceList
  resources={[
    {
      title: "DKIM Validator",
      link: "https://app.dmarcanalyzer.com/dkim/check",
      description: "Online DKIM record checker"
    },
    {
      title: "Key Rotation Script",
      link: "/scripts/dkim-rotate.sh",
      description: "Automated key rotation script"
    }
  ]}
/>
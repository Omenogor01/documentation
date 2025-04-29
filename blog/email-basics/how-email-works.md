---
title: "How Email Works: From Send to Receive"
date: "2024-03-25"
author: 
  name: "Emily Davis"
  role: "Email Infrastructure Engineer"
  avatar: "/assets/images/authors/emily-davis.jpg"
tags: ["email", "basics", "protocols"]
---

import { Steps, Video } from '../../components/blog/Components'

## The Email Journey

<Steps>
  <Step title="1. Composition">
    User writes email in client (Gmail, Outlook)
  </Step>
  
  <Step title="2. Submission">
    Email sent via SMTP to outgoing mail server
  </Step>

  <Step title="3. Routing">
    DNS MX records direct email to recipient's server
  </Step>

  <Step title="4. Delivery">
    Stored in recipient's mailbox (IMAP/POP3)
  </Step>
</Steps>

## Key Components

<CardGroup cols={3}>
  <Card icon="server" title="MTA">
    Mail Transfer Agent (e.g., Postfix)
  </Card>
  
  <Card icon="inbox" title="MDA">
    Mail Delivery Agent (e.g., Dovecot)
  </Card>

  <Card icon="user" title="MUA">
    Mail User Agent (e.g., Thunderbird)
  </Card>
</CardGroup>

<Video 
  src="/assets/videos/email-flow.mp4" 
  title="Email Transmission Process"
/>
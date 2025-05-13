---
title: "The Anatomy of an Email: Headers, Body, and Attachments"
date: 2025-05-13
author: "Samuel Omenogor"
category: "Email Basics"
summary: "Break down the structure of an email, including headers, body, and attachments, to understand how messages are constructed and delivered."
description: "Learn the components of an email, how headers work, and how attachments are encoded and transmitted."
tags:
  - email
  - headers
  - body
  - attachments
image: /blog-logo.png
---

# The Anatomy of an Email: Headers, Body, and Attachments

Understanding the structure of an email is essential for troubleshooting deliverability, ensuring security, and optimizing communication.

---

## Email Headers
- **From:** Sender’s email address
- **To:** Recipient’s email address
- **Subject:** Email topic
- **Date:** Time sent
- **Message-ID:** Unique identifier
- **MIME-Version:** Email format version
- **Received:** Delivery path (shows each server the message passed through)

---

## Email Body
- **Plain Text:** The basic readable content
- **HTML:** Rich formatting, images, and links
- **Multipart:** Combines plain text and HTML for compatibility

---

## Attachments
Attachments are included using MIME encoding. Each attachment has its own header specifying the file type and encoding method.

---

## Example: Raw Email
```eml
From: alice@example.com
To: bob@example.com
Subject: Project Update
Date: Tue, 13 May 2025 10:00:00 +0300
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="boundary123"

--boundary123
Content-Type: text/plain; charset="UTF-8"

Hi Bob,

Here’s the latest update on the project.

--boundary123
Content-Type: application/pdf; name="update.pdf"
Content-Disposition: attachment; filename="update.pdf"
Content-Transfer-Encoding: base64

JVBERi0xLjQKJaqrrK0KNCAwIG9iago8PC9UeXBlIC9QYWdl...
--boundary123--
```

---

## Key Takeaways
- Understanding headers helps diagnose deliverability issues
- Multipart emails ensure compatibility
- Attachments use MIME encoding

---

*See the [Email Glossary](../glossary.md) for definitions of technical terms.*

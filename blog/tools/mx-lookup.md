---
title: "MX Record Lookup Tool"
date: 2025-05-14
summary: "Check the MX (Mail Exchange) records for any domain instantly."
description: "Use this free tool to look up MX records for any domain and troubleshoot email deliverability issues."
tags:
  - mx
  - dns
  - email
  - tools
image: /blog-logo.png
---

# MX Record Lookup Tool

Quickly check the MX (Mail Exchange) records for any domain to diagnose email delivery issues.

---

<form id="mx-lookup-form" style="max-width:400px;margin:2rem 0;">
  <label for="domain">Domain:</label><br>
  <input type="text" id="domain" name="domain" placeholder="example.com" required style="width:100%;padding:8px;margin:8px 0;">
  <button type="submit" style="background:#1a365d;color:#fff;padding:10px 20px;border:none;border-radius:4px;cursor:pointer;">Lookup MX Records</button>
</form>

<div id="mx-results" style="margin-top:1.5rem;"></div>

<script>
document.getElementById('mx-lookup-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const domain = document.getElementById('domain').value.trim();
  const resultsDiv = document.getElementById('mx-results');
  resultsDiv.innerHTML = 'Looking up MX records...';
  try {
    const response = await fetch(`/.netlify/functions/mxlookup?domain=${encodeURIComponent(domain)}`);
    if (!response.ok) throw new Error('Lookup failed');
    const data = await response.json();
    if (data && data.mx && data.mx.length > 0) {
      resultsDiv.innerHTML = `<b>MX Records for ${domain}:</b><ul>` + data.mx.map(mx => `<li><b>Priority:</b> ${mx.priority}, <b>Host:</b> ${mx.exchange}</li>`).join('') + '</ul>';
    } else {
      resultsDiv.innerHTML = 'No MX records found or the domain is invalid.';
    }
  } catch (err) {
    resultsDiv.innerHTML = 'Error looking up MX records.';
  }
});
</script>

---

*Powered by DNS over HTTPS API. For advanced diagnostics, try [MXToolbox](https://mxtoolbox.com).*

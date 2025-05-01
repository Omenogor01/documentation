---
title: "Compliance Dashboard Component - Track Compliance Standards"
description: "Learn how to use the Compliance Dashboard component to track and display compliance standards like GDPR and CCPA. View requirements and implementation status in a clean, accessible layout."
keywords: ["Compliance Dashboard", "GDPR", "CCPA", "Compliance Standards", "Accessibility", "Enterprise"]
author: "Your Name"
---

# Compliance Dashboard Component

The **Compliance Dashboard** component is a powerful tool for tracking and displaying compliance standards such as **GDPR** and **CCPA**. It provides a clean and accessible layout to view requirements and their implementation status, helping organizations stay compliant.

## Features

* Multi-Standard Support: Easily switch between compliance standards like GDPR and CCPA
* Requirements Overview: Displays a list of requirements for each standard
* Implementation Status: Highlights completed and pending tasks for compliance
* Accessible Design: Includes ARIA labels for improved screen reader support
* Responsive Layout: Works seamlessly across devices and screen sizes

## Example Usage

Here’s an example of how the Compliance Dashboard can be used to track GDPR and CCPA compliance:

### GDPR Compliance

#### Requirements

* Data Protection Impact Assessment
* Right to Erasure
* Data Breach Notification

#### Implementation Status

* Data Protection Impact Assessment: Implemented
* Right to Erasure: Pending
* Data Breach Notification: Implemented

### CCPA Compliance

#### Requirements

* Right to Know
* Right to Delete
* Opt-Out of Sale

#### Implementation Status

* Right to Know: Implemented
* Right to Delete: Pending
* Opt-Out of Sale: Pending

## How It Works

The Compliance Dashboard organizes compliance standards into two main sections:

1. Requirements: A list of tasks or obligations required to meet the standard
2. Implementation Status: Indicates whether each requirement has been implemented or is still pending

## Why Use the Compliance Dashboard?

* Simplify Compliance Tracking: Easily monitor multiple compliance standards in one place
* Improve Accessibility: Designed with ARIA labels to ensure inclusivity
* Enterprise-Ready: Ideal for organizations managing complex compliance requirements

## Example Scenarios

The Compliance Dashboard is perfect for:

* Enterprise Compliance: Track GDPR, CCPA, or other regulatory standards
* Audit Preparation: Ensure all requirements are met before an audit
* Team Collaboration: Share compliance progress with your team

Thank you for exploring the **Compliance Dashboard** component. Use it to streamline your compliance tracking and ensure your organization stays ahead of regulatory requirements!

import React, { useState } from 'react';

/**
 * ComplianceDashboard Component
 * Description: A React component for displaying compliance standards and their implementation status. Allows users to switch between different standards (e.g., GDPR, CCPA) and view requirements and status in a clean, accessible layout.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Compliance Dashboard", "React Component", "Enterprise", "SEO", "Accessibility"]
 */

export const ComplianceDashboard = ({ standards }) => {
  const [selectedStandard, setStandard] = useState('gdpr');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Standard Selection Buttons */}
      <div className="flex space-x-4 mb-6" aria-label="Compliance Standards">
        {Object.keys(standards).map((standard) => (
          <button
            key={standard}
            onClick={() => setStandard(standard)}
            className={`px-4 py-2 rounded ${
              selectedStandard === standard
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            aria-label={`Select ${standard.toUpperCase()} standard`}
          >
            {standard.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Requirements and Implementation Status */}
      <div className="grid grid-cols-2 gap-6">
        {/* Requirements Section */}
        <div>
          <h4 className="font-bold mb-3" aria-label="Requirements">
            Requirements
          </h4>
          <ul className="list-disc pl-6 space-y-2">
            {standards[selectedStandard].requirements.map((req, i) => (
              <li key={i} className="text-gray-800">
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Implementation Status Section */}
        <div>
          <h4 className="font-bold mb-3" aria-label="Implementation Status">
            Implementation Status
          </h4>
          <div className="space-y-3">
            {standards[selectedStandard].status.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
                aria-label={`Requirement: ${item.label}, Status: ${
                  item.complete ? 'Implemented' : 'Pending'
                }`}
              >
                <span className="text-gray-800">{item.label}</span>
                <span
                  className={`px-2 py-1 rounded ${
                    item.complete
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.complete ? 'Implemented' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example Usage
// <ComplianceDashboard
//   standards={{
//     gdpr: {
//       requirements: ['Data Protection Impact Assessment', 'Right to Erasure', 'Data Breach Notification'],
//       status: [
//         { label: 'Data Protection Impact Assessment', complete: true },
//         { label: 'Right to Erasure', complete: false },
//         { label: 'Data Breach Notification', complete: true },
//       ],
//     },
//     ccpa: {
//       requirements: ['Right to Know', 'Right to Delete', 'Opt-Out of Sale'],
//       status: [
//         { label: 'Right to Know', complete: true },
//         { label: 'Right to Delete', complete: false },
//         { label: 'Opt-Out of Sale', complete: false },
//       ],
//     },
//   }}
// />
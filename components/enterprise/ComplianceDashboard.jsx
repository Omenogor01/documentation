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
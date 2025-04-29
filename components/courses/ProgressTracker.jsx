import React from 'react';

/**
 * ProgressTracker Component
 * Description: A React component to visually display the progress of a course or task list. Highlights completed steps and the current step in a clean and accessible layout.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Progress Tracker", "React Component", "Course Progress", "SEO", "Accessibility"]
 */

export const ProgressTracker = ({ steps, currentStep }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-bold mb-4" aria-label="Course Progress Tracker">
      Course Progress
    </h3>
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step Indicator */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            aria-label={`Step ${index + 1}: ${
              index < currentStep ? 'Completed' : index === currentStep ? 'Current Step' : 'Pending'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
          {/* Step Title */}
          <span className="ml-3 text-gray-800">{step.title}</span>
        </div>
      ))}
    </div>
  </div>
);

// Example Usage
// <ProgressTracker
//   steps={[
//     { title: 'Introduction' },
//     { title: 'Module 1: Basics' },
//     { title: 'Module 2: Advanced Topics' },
//     { title: 'Final Assessment' },
//   ]}
//   currentStep={2}
// />
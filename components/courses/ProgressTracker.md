---
title: "Progress Tracker Component - Visualize Course Progress"
description: "Learn how to use the Progress Tracker component to visually display the progress of a course or task list. Highlights completed steps and the current step in a clean and accessible layout."
keywords: ["Progress Tracker", "Course Progress", "Task Progress", "Accessibility", "Responsive Design"]
author: "Your Name"
---

# Progress Tracker Component

The **Progress Tracker** component is a versatile tool for visually displaying the progress of a course or task list. It highlights completed steps, the current step, and pending steps in a clean and accessible layout.

---

## Features

- **Visual Progress**: Clearly indicates completed, current, and pending steps.  
- **Accessibility**: Includes ARIA labels for improved screen reader support.  
- **Customizable**: Easily adapt the component to fit your course or task structure.  
- **Responsive Design**: Works seamlessly across devices and screen sizes.

---

## Example Usage

Here’s an example of how to use the Progress Tracker component:

```markdown
## Steps
1. **Introduction**: Learn the basics of the course.
2. **Module 1: Basics**: Dive into foundational concepts.
3. **Module 2: Advanced Topics**: Explore advanced techniques.
4. **Final Assessment**: Test your knowledge and complete the course.

### Current Progress
- **Current Step**: Module 2: Advanced Topics
```

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
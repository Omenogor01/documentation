/**
 * Steps and Step Components
 * Description: A React component for displaying a series of steps in a clean and accessible layout. Ideal for tutorials, guides, or multi-step processes.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Steps", "React Component", "Tutorial", "SEO", "Accessibility"]
 */

export const Steps = ({ children }) => (
  <div className="space-y-6" aria-label="Steps Container">
    {children}
  </div>
);

export const Step = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-bold mb-4" aria-label={`Step: ${title}`}>
      {title}
    </h3>
    <div className="text-gray-700">{children}</div>
  </div>
);

// Example Usage
// <Steps>
//   <Step title="Step 1: Introduction">
//     Learn the basics of the process in this step.
//   </Step>
//   <Step title="Step 2: Configuration">
//     Configure the necessary settings to proceed.
//   </Step>
//   <Step title="Step 3: Finalization">
//     Complete the process and review the results.
//   </Step>
// </Steps>
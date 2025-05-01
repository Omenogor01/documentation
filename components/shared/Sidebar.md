/**
 * Sidebar Component
 * Description: A React component for displaying a sidebar with customizable content. Designed for accessibility and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Sidebar", "React Component", "SEO", "Accessibility"]
 */

export const Sidebar = ({ children }) => (
  <aside className="w-64 bg-white border-r border-gray-200 p-4" aria-label="Sidebar">
    <div className="space-y-4">
      <h3 className="font-bold mb-2" aria-label="Quick Links Section">Quick Links</h3>
      {children}
    </div>
  </aside>
);

// Example Usage
// <Sidebar>
//   <a href="/guide" className="text-blue-600 hover:underline" aria-label="Guide Page">
//     Guide
//   </a>
//   <a href="/faq" className="text-blue-600 hover:underline" aria-label="FAQ Page">
//     FAQ
//   </a>
// </Sidebar>




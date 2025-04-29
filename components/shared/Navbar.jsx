/**
 * Navbar Component
 * Description: A React component for the website navigation bar, including links to key pages and a brand logo. Designed for accessibility and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Navbar", "React Component", "SEO", "Accessibility"]
 */

export const Navbar = () => (
  <nav className="bg-white shadow-sm" aria-label="Main Navigation">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Brand Logo */}
        <a
          href="/"
          className="text-xl font-bold text-blue-600"
          aria-label="Email Mastery Home"
        >
          Email Mastery
        </a>
        {/* Navigation Links */}
        <div className="space-x-6">
          <a
            href="/courses"
            className="text-gray-700 hover:text-blue-600"
            aria-label="Courses Page"
          >
            Courses
          </a>
          <a
            href="/tools"
            className="text-gray-700 hover:text-blue-600"
            aria-label="Tools Page"
          >
            Tools
          </a>
        </div>
      </div>
    </div>
  </nav>
);

// Example Usage
// <Navbar />
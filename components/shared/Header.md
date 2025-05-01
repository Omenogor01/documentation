/**
 * Header Component
 * Description: A React component for the website header, including navigation links and a brand logo. Designed for accessibility and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Header", "React Component", "SEO", "Accessibility"]
 */

export const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center space-x-8">
        <a
          href="/"
          className="text-2xl font-bold text-blue-600"
          aria-label="EmailMastery Home"
        >
          EmailMastery
        </a>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6" aria-label="Main Navigation">
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
        </nav>
      </div>
      {/* Sign-In Section */}
      <div className="flex items-center space-x-4">
        <a
          href="/login"
          className="text-gray-700 hover:text-blue-600"
          aria-label="Sign In Page"
        >
          Sign In
        </a>
      </div>
    </div>
  </header>
);

// Example Usage
// <Header>
// </Header>




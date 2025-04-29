/**
 * Footer Component
 * Description: A React component for the website footer, containing links to guides, company information, and legal pages. Designed for accessibility and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Footer", "React Component", "SEO", "Accessibility"]
 */

export const Footer = () => (
  <footer className="bg-gray-100 mt-12 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-8">
        {/* Guides Section */}
        <div>
          <h4 className="font-bold mb-4" aria-label="Guides Section">Guides</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/spf"
                className="text-gray-700 hover:text-blue-600"
                aria-label="SPF Setup Guide"
              >
                SPF Setup
              </a>
            </li>
            <li>
              <a
                href="/dkim"
                className="text-gray-700 hover:text-blue-600"
                aria-label="DKIM Guide"
              >
                DKIM Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="font-bold mb-4" aria-label="Company Section">Company</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                className="text-gray-700 hover:text-blue-600"
                aria-label="About Us Page"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-700 hover:text-blue-600"
                aria-label="Contact Page"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="font-bold mb-4" aria-label="Legal Section">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/privacy"
                className="text-gray-700 hover:text-blue-600"
                aria-label="Privacy Policy Page"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="text-gray-700 hover:text-blue-600"
                aria-label="Terms of Service Page"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

// Example Usage
// <Footer />
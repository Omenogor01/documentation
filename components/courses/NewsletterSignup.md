/**
 * NewsletterSignup Component
 * Description: A React component for a newsletter signup form. Designed to capture user emails with a clean and accessible layout.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Newsletter Signup", "React Component", "SEO", "Accessibility"]
 */

export const NewsletterSignup = ({ title, subtitle, buttonText }) => (
  <div className="bg-blue-50 p-8 rounded-lg text-center mt-12">
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{subtitle}</p>
    <form
      className="max-w-md mx-auto flex gap-4"
      aria-label="Newsletter Signup Form"
      onSubmit={(e) => {
        e.preventDefault();
        // Add subscription logic here
        alert('Thank you for subscribing!');
      }}
    >
      <label htmlFor="email" className="sr-only">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="flex-1 p-3 rounded border"
        required
        aria-required="true"
        aria-label="Enter your email address"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        aria-label="Subscribe to the newsletter"
      >
        {buttonText}
      </button>
    </form>
  </div>
);

// Example Usage
// <NewsletterSignup
//   title="Join Our Newsletter"
//   subtitle="Get the latest updates and insights delivered to your inbox."
//   buttonText="Subscribe"
// />
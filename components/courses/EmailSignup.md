import React, { useState } from 'react';

/**
 * EmailSignup Component
 * Description: A React component for a newsletter signup form. Allows users to subscribe to the Email Mastery Newsletter with a clean and accessible design.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Email Signup", "React Component", "Newsletter", "SEO", "Accessibility"]
 */

export const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setSubscribed(true);
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">📧 Email Mastery Newsletter</h3>
      {!subscribed ? (
        <form onSubmit={handleSubmit} className="space-y-3" aria-label="Newsletter Signup Form">
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border"
            required
            aria-required="true"
            aria-label="Enter your email address" />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            aria-label="Subscribe to the Email Mastery Newsletter"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-green-600" aria-live="polite">
          Thanks for subscribing!
        </p>
      )}
    </div>
  );
};

// Example Usage
// <EmailSignup>
// </EmailSignup>




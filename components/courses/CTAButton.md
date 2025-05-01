/**
 * CTAButton Component
 * Description: A reusable call-to-action (CTA) button component for links. Designed for accessibility, responsiveness, and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["CTA Button", "React Component", "SEO", "Accessibility"]
 */

import React from 'react';

export default function CTAButton({ href, className = '', children, ariaLabel }) {
  return (
    <a
      href={href}
      className={`cta-button ${className}`}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        background: '#1a365d',
        color: 'white',
        borderRadius: '6px',
        textDecoration: 'none',
        transition: 'transform 0.2s, background-color 0.2s',
        textAlign: 'center',
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || 'Call to Action'}
      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
    >
      {children}
    </a>
  );
}

// Example Usage
// <CTAButton>
// </CTAButton>>
// </CTAButton>
//   href="https://example.com"
//   className="custom-class"
//   ariaLabel="Learn more about our services"
// >
//   Learn More
// </CTAButton>




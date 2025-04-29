import React from 'react';
import { TwitterIcon, LinkedInIcon } from '../icons'; // Adjust the import path as needed

/**
 * AuthorBio Component
 * Description: Displays the author's bio, including their name, role, avatar, social media links, and a brief biography.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Author Bio", "React Component", "SEO", "Blog"]
 */

export const AuthorBio = ({ author }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-8 shadow-md">
      <div className="flex items-center gap-4">
        {/* Author Avatar */}
        <img
          src={author.avatar}
          alt={`Avatar of ${author.name}`}
          className="w-16 h-16 rounded-full"
          loading="lazy"
        />
        <div>
          {/* Author Name and Role */}
          <h3 className="text-xl font-bold text-gray-800">{author.name}</h3>
          <p className="text-gray-600">{author.role}</p>
          {/* Social Media Links */}
          <div className="flex gap-3 mt-2">
            {author.socials?.twitter && (
              <a
                href={author.socials.twitter}
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${author.name} on Twitter`}
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            )}
            {author.socials?.linkedIn && (
              <a
                href={author.socials.linkedIn}
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${author.name} on LinkedIn`}
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Author Bio */}
      <p className="mt-4 text-gray-700">{author.bio}</p>
    </div>
  );
};

// Example Usage
// <AuthorBio
//   author={{
//     name: "David Wilson",
//     role: "DNS Specialist",
//     avatar: "/images/authors/david-wilson.jpg",
//     socials: {
//       twitter: "https://twitter.com/davidwilson",
//       linkedIn: "https://linkedin.com/in/davidwilson"
//     },
//     bio: "David is a DNS specialist with over 10 years of experience in email authentication and deliverability."
//   }}
// />;
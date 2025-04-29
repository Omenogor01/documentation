/**
 * Video Component
 * Description: A React component for embedding videos with a title and responsive layout. Designed for accessibility and SEO optimization.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Video", "React Component", "SEO", "Accessibility"]
 */

export const Video = ({ src, title }) => (
  <div className="my-6">
    <video
      controls
      className="w-full aspect-video rounded-lg"
      src={src}
      title={title}
      aria-label={`Video: ${title}`}
    />
    <p className="text-sm text-gray-600 mt-2" aria-label={`Video Title: ${title}`}>
      {title}
    </p>
  </div>
);

// Example Usage
// <Video
//   src="/assets/videos/example-video.mp4"
//   title="How to Configure SPF Records"
// />
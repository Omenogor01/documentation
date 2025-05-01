---
title: "Video Component - Embed Videos with Accessibility and SEO"
description: "Learn how to use the Video component to embed videos with a responsive layout, accessibility features, and SEO optimization. Perfect for tutorials and guides."
keywords: ["Video Component", "Embed Videos", "Responsive Design", "Accessibility", "SEO"]
author: "Your Name"
---

## Video Component

The **Video** component is a versatile tool for embedding videos in your documentation or tutorials. It features a responsive layout, accessibility enhancements, and SEO-friendly attributes to ensure a great user experience.

## Features

* Responsive Design: Automatically adjusts to fit various screen sizes
* Accessibility: Includes ARIA labels and descriptive titles for screen readers
* SEO Optimization: Uses proper metadata to improve search engine visibility
* Customizable: Easily adapt the component to fit your content needs

## Example Usage

Here's an example of how to embed a video using the Video component:

### Example Video: How to Configure SPF Records

```markdown
<video controls class="w-full aspect-video rounded-lg" src="/assets/videos/example-video.mp4" title="How to Configure SPF Records" aria-label="Video: How to Configure SPF Records"></video>

**Video Title**: How to Configure SPF Records
Learn how to configure SPF records to improve email deliverability and protect your domain from spoofing.
```

## Implementation Details

### Props

* `src`: URL or path to the video file
* `title`: Title of the video

### Example

```jsx
<Video
  src="/assets/videos/example-video.mp4"
  title="How to Configure SPF Records">
</Video>
```

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
      aria-label={`Video: ${title}`}>
      </video>
    <p className="text-sm text-gray-600 mt-2" aria-label={`Video Title: ${title}`}>
      {title}
    </p>
  </div>
);




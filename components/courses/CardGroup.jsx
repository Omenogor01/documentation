/**
 * CardGroup and Card Components
 * Description: A reusable CardGroup component for displaying a grid of cards and a Card component for individual content blocks.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Card Group", "React Component", "SEO", "Grid Layout"]
 */

export const CardGroup = ({ children, cols = 3 }) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-${cols} gap-6`}
    role="group"
    aria-label="Card Group"
  >
    {children}
  </div>
);

export const Card = ({ title, icon, children }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    role="article"
    aria-labelledby={`card-title-${title}`}
  >
    <div className="flex items-center mb-4">
      {/* Icon */}
      {icon && <span className="text-2xl mr-3" aria-hidden="true">{icon}</span>}
      {/* Title */}
      <h3
        id={`card-title-${title}`}
        className="text-xl font-bold text-gray-800"
      >
        {title}
      </h3>
    </div>
    {/* Content */}
    <div className="text-gray-700">{children}</div>
  </div>
);

// Example Usage
// <CardGroup cols={3}>
//   <Card title="Card 1" icon="🌱">
//     This is the content for Card 1.
//   </Card>
//   <Card title="Card 2" icon="🌟">
//     This is the content for Card 2.
//   </Card>
//   <Card title="Card 3" icon="🔥">
//     This is the content for Card 3.
//   </Card>
// </CardGroup>
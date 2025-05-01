---
title: "Card Group Component - Reusable Grid Layout"
description: "Learn how to use the Card Group component to create a responsive grid layout for displaying content blocks. Perfect for showcasing features, services, or articles."
keywords: ["Card Group", "Grid Layout", "Responsive Design", "Reusable Components", "Content Blocks"]
author: "Your Name"
---

# Card Group Component

The **Card Group** component is a reusable layout designed to display a grid of content blocks. It is perfect for showcasing features, services, or articles in a visually appealing and responsive format.

---

## Features

- **Responsive Design**: Automatically adjusts the number of columns based on the screen size.  
- **Customizable Layout**: Specify the number of columns to fit your content needs.  
- **Reusable Components**: Easily integrate the Card Group and Card components into your project.

---

## Card Group Layout

The **Card Group** component creates a flexible grid layout for organizing multiple cards. Each card can include a title, an icon, and custom content.

### Example Layout

```markdown
## 🌱 Sustainability Features
- **Feature 1**: Eco-friendly materials.
- **Feature 2**: Energy-efficient design.
```

## Example Usage

Here’s an example of how to use the `CardGroup` and `Card` components in a React project:

```jsx
<CardGroup cols={3}>
  <Card title="Card 1" icon="🌱">
    This is the content for Card 1.
  </Card>
  <Card title="Card 2" icon="🌟">
    This is the content for Card 2.
  </Card>
  <Card title="Card 3" icon="🔥">
    This is the content for Card 3.
  </Card>
</CardGroup>
```


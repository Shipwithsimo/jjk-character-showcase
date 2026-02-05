# ⚡ JJK Character Showcase

An immersive, interactive character showcase experience featuring Jujutsu Kaisen characters. Built with React, TypeScript, and Framer Motion, this project brings anime characters to life with physics-based animations, custom cursors, and dynamic visual effects. I built this side project for learning purposes and to explore advanced animation techniques.

## 📦 Technologies

- **Vite**
- **React.js**
- **TypeScript**
- **Framer Motion**
- **Tailwind CSS**
- **Sonner**

## 🦄 Features

Here's what you can do with JJK Character Showcase:

**Choose a Character**: Explore five iconic Jujutsu Kaisen characters - Itadori Yuji, Gojo Satoru, Ryomen Sukuna, Toji Fushiguro, and Maki Zen'in. Hover over their names to preview their scenes.

**Interactive Physics**: Each character has unique physics-based animations. Watch as scene cards float, bounce, and interact with realistic physics tailored to each character's personality - Gojo's cards repel each other with Infinity-like effects, while Sukuna's move with chaotic energy.

**Dynamic Visual Effects**: Experience custom themed cursors that change based on the selected character, dynamic backgrounds with color transitions, energy auras, and smooth trail effects that follow your mouse.

**Voice Lines & Effects**: Select a character to hear their signature voice lines. Powerful characters like Gojo and Sukuna trigger domain expansion shake effects that make the entire page tremble.

**Scene Gallery**: Click on any scene card to open a full-screen modal with a detailed image carousel. Navigate through multiple iconic scenes from each character.

**Keyboard Navigation**: Use arrow keys (↑/↓) to navigate between characters, Enter/Space to select, and Escape to close modals or deselect characters.

**Performance Optimizations**: The app includes intelligent performance gating that disables certain effects on lower-end devices, lazy loading for modals, and smooth 60fps animations with reduced motion support.

## 🎯 Keyboard Shortcuts

Speed up your exploration with these shortcuts:

- **Arrow Up/Down**: Navigate between characters
- **Enter or Space**: Select/lock a character
- **Escape**: Close modal or deselect character
- **Click**: Lock/unlock character preview

## 👩🏽‍🍳 The Process

I started by setting up the core character selection interface with hover interactions. The goal was to create an elegant, minimalist design that puts the characters front and center.

Next, I implemented the physics engine for the scene cards. Each character needed unique physics properties that matched their personality - Gojo's Infinity technique inspired repulsion physics, Toji's speed translated to dash mechanics, and Sukuna's chaos became random impulses.

The custom cursor system came next, dynamically changing colors based on the selected character and following mouse movement with smooth spring animations. I paired this with themed backgrounds that smoothly transition between character color palettes.

To make the experience more immersive, I added voice line playback when selecting characters and screen shake effects for domain expansions. These subtle touches significantly enhanced the feel of interacting with powerful characters.

The scene modal required careful optimization - I implemented lazy loading, image preloading, and efficient keyboard navigation to ensure smooth performance even with multiple high-quality GIFs.

Throughout development, I focused heavily on performance. I built a performance gating system that detects device capabilities and disables expensive effects on lower-end hardware. I also added support for users who prefer reduced motion.

Finally, I polished the mobile experience by adding a warning system that guides users to desktop for the optimal experience, since many effects rely on mouse interaction.

## 📚 What I Learned

During this project, I've picked up important skills and a deeper understanding of advanced animation and interaction patterns.

### 🎨 Advanced Animation with Framer Motion
**Spring Physics**: I learned to use spring animations for natural, fluid motion. Understanding the relationship between stiffness, damping, and mass helped me create animations that feel alive rather than mechanical.

**Animation Orchestration**: Managing multiple concurrent animations taught me about animation lifecycle, sequencing, and how to prevent conflicts between different animated elements.

### 🎮 Custom Physics Engine
**Physics Simulation**: Building character-specific physics from scratch deepened my understanding of velocity, acceleration, collision detection, and how to make digital objects feel like they have weight and momentum.

**Magnetism Effects**: Implementing repulsion and attraction forces taught me vector mathematics and how to create organic-feeling interactions between elements.

### 🖱️ Advanced Mouse Tracking
**Smooth Mouse Following**: I learned about spring-based interpolation and how to create smooth, lag-free cursor tracking that enhances rather than distracts from the user experience.

**3D Mouse Effects**: Working with perspective transforms and mouse-relative positioning helped me understand how to create depth and dimensionality in 2D interfaces.

### 🎭 Performance Optimization
**Performance Gating**: I discovered how to detect device capabilities and gracefully degrade features, ensuring everyone gets a good experience regardless of their hardware.

**Lazy Loading Strategy**: Learning when and how to defer loading expensive components taught me about code splitting, Suspense boundaries, and optimizing initial page load.

**Reduced Motion**: Implementing accessibility features for users with motion sensitivity made me think deeply about progressive enhancement and inclusive design.

### 🎪 Custom Hooks Architecture
**Complex State Logic**: I built numerous custom hooks (usePhysicsEngine, useSmoothMouse, useVoiceLines, useDomainShake) and learned how to encapsulate complex logic in reusable, testable units.

**Hook Composition**: Understanding how to compose multiple hooks together taught me about separation of concerns and building maintainable React applications.

### 🎨 Dynamic Theming
**Runtime Theme Switching**: I learned to create a color system that dynamically adapts based on selected characters, including smooth transitions between color palettes.

**CSS-in-JS Integration**: Working with Tailwind while also managing dynamic styles taught me when to use utility classes versus inline styles.

### 🔧 TypeScript Mastery
**Advanced Types**: Creating type-safe physics configurations, character data structures, and animation variants deepened my understanding of TypeScript's type system.

**Type Guards**: I learned to write proper type narrowing and guards to ensure runtime type safety throughout the application.

### 📈 Overall Growth
This project pushed me far beyond basic React development. I learned to think about user experience holistically - not just making things work, but making them feel right. The physics had to feel natural, the animations had to be smooth, and the interactions had to be responsive.

Building a custom physics engine taught me computational thinking and numerical methods. Creating smooth, 60fps animations taught me about browser performance and the rendering pipeline. Implementing accessibility features taught me about inclusive design.

Most importantly, I learned that great user experiences come from attention to detail - the way a card bounces, the smoothness of a color transition, the subtle shake when selecting a powerful character. These micro-interactions compound into something that feels polished and professional.

## 💭 How can it be improved?

- Add more characters from the Jujutsu Kaisen universe
- Implement sound effects for physics interactions (card collisions, bounces)
- Add character stat visualizations and power comparisons
- Create a "Domain Expansion" mode with immersive fullscreen effects
- Add more scene images for each character
- Implement touch gestures for mobile devices
- Add particle effects specific to each character's techniques
- Create character vs character comparison mode
- Add animation preset editor for users to customize physics
- Implement WebGL shaders for more advanced visual effects
- Add ability to save favorite scenes or create custom collections
- Create shareable links for specific character/scene combinations

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine
2. Run `npm install` or `yarn` in the project directory to install the required dependencies
3. Run `npm run dev` or `yarn dev` to get the project started
4. Open http://localhost:5173 (or the address shown in your console) in your web browser to view the app

## 🎥 Preview

https://github.com/user-attachments/assets/b37d9864-5c9a-4745-8191-a2e1927520af

## 📝 License

Copyright (c) 2026 shipwithsimo

---

Built with ❤️ by [shipwithsimo](https://github.com/shipwithsimo)

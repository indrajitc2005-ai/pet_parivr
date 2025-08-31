# 📘 Project Best Practices

## 1. Project Purpose  
Furry Tails is a modern veterinary website featuring a futuristic design with AI chatbot integration. The project provides pet care services including pharmacy, grooming, toys, and doctor consultations. It emphasizes a glass morphism aesthetic with cyan/pink/purple color schemes and advanced CSS animations for an engaging user experience.

## 2. Project Structure  
- **Root Level**: HTML pages for different services (pharmacy.html, grooming.html, toys.html, etc.)
- **css/**: Modular CSS architecture with separate files for different concerns
  - `base.css`: Core variables, typography, and foundational styles
  - `layout.css`: Grid systems and responsive layouts
  - `components.css`: Reusable UI components (cards, buttons, forms)
  - `animations.css`: Animation definitions and keyframes
  - `chatbot.css`: AI chatbot specific styling
  - `preloader.css`: Loading screen animations
  - `scroll-frames.css`: Scroll-triggered animations
  - `new-sections.css`: Additional feature sections
- **js/**: JavaScript modules organized by functionality
  - `app.js`: Core application logic and DOM manipulation
  - `chatbot.js`: AI assistant functionality
  - `auth.js`: Authentication and user management
  - `pet-care-knowledge.js`: Pet care data and knowledge base
  - `scroll-frames.js`: Scroll animation controllers
  - `new-sections.js`: Interactive section behaviors
- **tests/**: Jest-based testing suite with DOM environment setup
- **JSON files**: Static data for services, products, and content (community.json, emergency.json, etc.)

## 3. Test Strategy  
- **Framework**: Jest with jsdom environment for DOM testing
- **Configuration**: Centralized in `jest.config.js` and `package.json`
- **Test Location**: All tests in `/tests/` directory with `.test.js` suffix
- **Setup**: Global test setup in `tests/setup.js` for DOM environment
- **Coverage**: Configured to collect from `js/**/*.js` excluding minified files
- **Naming**: Test files mirror source file names (e.g., `app.test.js` for `app.js`)
- **Timeout**: 10-second timeout for async operations
- **Philosophy**: Focus on DOM manipulation, user interactions, and component behavior testing

## 4. Code Style  
- **CSS Variables**: Extensive use of CSS custom properties for theming and consistency
- **Color Scheme**: Futuristic palette with cyan (#78dbff), pink (#ff77c6), and purple (#a78bfa)
- **Naming Conventions**: 
  - CSS classes: kebab-case (e.g., `pet-scene-container`, `mobile-menu-btn`)
  - JavaScript functions: camelCase (e.g., `initializeChatbot`, `handleUserInput`)
  - CSS variables: double-dash prefix with descriptive names (e.g., `--accent-gradient`, `--transition-slow`)
- **Glass Morphism**: Consistent use of `backdrop-filter: blur()` and semi-transparent backgrounds
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Animation Timing**: Standardized easing functions and duration variables
- **Error Handling**: Graceful degradation for missing elements and API failures

## 5. Common Patterns  
- **Modular CSS Architecture**: Separation of concerns with dedicated CSS files
- **CSS Custom Properties**: Centralized theming system with semantic variable names
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Component-Based Design**: Reusable card, button, and form components
- **Animation System**: Consistent timing functions and hover effects
- **Mobile-First Responsive**: Breakpoints at 768px, 900px, and 1200px
- **Glass Morphism Effects**: Layered backgrounds with blur effects and subtle borders
- **Scroll-Triggered Animations**: Intersection Observer for performance-optimized animations
- **Event Delegation**: Efficient event handling for dynamic content

## 6. Do's and Don'ts  
### ✅ Do's
- Use CSS custom properties for all colors, spacing, and timing values
- Implement hover states with smooth transitions and visual feedback
- Follow the established glass morphism aesthetic with backdrop-filter
- Use semantic HTML elements for accessibility
- Test interactive features across different screen sizes
- Maintain consistent border-radius values using CSS variables
- Use transform properties for animations to ensure GPU acceleration
- Implement proper focus states for keyboard navigation

### ❌ Don'ts  
- Don't hardcode color values - always use CSS custom properties
- Don't create animations without considering reduced motion preferences
- Don't use inline styles - maintain separation of concerns
- Don't ignore mobile responsiveness - test on actual devices
- Don't create overly complex selectors - keep CSS maintainable
- Don't forget to handle loading states for dynamic content
- Don't use deprecated HTML attributes or CSS properties
- Don't implement features without considering accessibility

## 7. Tools & Dependencies  
- **Testing**: Jest (^29.7.0) with jsdom environment for DOM testing
- **CSS**: Pure CSS with extensive custom properties system
- **JavaScript**: Vanilla ES6+ with modern DOM APIs
- **Build Process**: No build step required - direct browser execution
- **Development**: Live server recommended for local development
- **Browser Support**: Modern browsers with CSS Grid and Custom Properties support
- **Performance**: Optimized with CSS transforms and Intersection Observer API

## 8. Other Notes  
- **AI Integration**: The chatbot system expects specific DOM structure and CSS classes
- **Animation Performance**: All animations use transform and opacity for optimal performance
- **Color Accessibility**: Ensure sufficient contrast ratios when modifying the color scheme
- **Mobile Navigation**: Hamburger menu system with overlay for mobile devices
- **Loading States**: Preloader system with pet-themed animations
- **Data Structure**: JSON files contain structured data for easy content management
- **SEO Considerations**: Semantic HTML structure with proper heading hierarchy
- **Future Enhancements**: Architecture supports easy addition of new service pages and features
- **Browser Compatibility**: Graceful degradation for older browsers without CSS Grid support
- **Performance Optimization**: Lazy loading and intersection observers used for scroll animations
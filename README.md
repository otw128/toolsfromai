# Vue 3 + Vite Workspace

This project has been converted to Vue 3 + Vite from a static HTML project.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

- `src/main.js` - Application entry point
- `src/App.vue` - Root component
- `src/router/index.js` - Vue Router configuration
- `src/views/` - Page components
  - `HomeView.vue` - Main landing page
  - `HtmlFormatterView.vue` - HTML formatter files list
  - `MermaidFormatterView.vue` - Mermaid formatter files list
- `src/style.css` - Global styles
- `public/` - Static assets
- `web/` - Original HTML files (linked from Vue views)

## Features

- Vue 3 with Composition API
- Vue Router for navigation
- Vite for fast development and building
- Responsive design with gradient backgrounds
- Hover effects and smooth transitions

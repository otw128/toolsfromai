---
name: list-show-vue
description: Create a Vue component that lists all components in a directory and add it to the home page
---

# List Show Vue Component Generator

## Description
This skill creates a Vue component that lists all Vue components in the same directory, following the project's established pattern. Each component is displayed as a clickable card with a file icon, and a link to this new component is added to the home page.

## Input
- **Path**: The directory path where the new Vue component should be created (relative to the src directory, e.g., `views/tools/utils/qrcode`)

## Workflow
1. Create a new Vue component named `ComponentList.vue` in the specified directory
2. The component defines a `files` array containing objects with:
   - `name`: Component filename (e.g., 'QrcodeCg.vue')
   - `path`: Route path for the component (e.g., '/tools/utils/qrcode/QrcodeCg.vue')
3. Display components using `RouterLink` with:
   - File icon SVG (24x24 document icon)
   - Component name display
   - Arrow icon that appears on hover
4. Add a new entry to the home page (`HomeView.vue`) files array with:
   - `name`: Display name (e.g., 'QR Code Components')
   - `description`: Brief description of the component group
   - `route`: Route path to the list component (e.g., '/qrcode-components')
   - `gradient`: CSS gradient for hover effects
5. Add routes in `router/index.js`:
   - Route for the list component
   - Individual routes for each component file
6. Install any required npm packages if components have dependencies

## Component Features
- **Manual Listing**: Components are listed manually following the project pattern (similar to MermaidPreview, VideoToGifView)
- **Clickable Router Links**: Each component uses `RouterLink` to navigate to its route
- **Card-based UI**: Each item displays as a card with icon, name, and hover effects
- **Gradient Backgrounds**: Container and hover effects use consistent gradient styling
- **Back Navigation**: Footer section with "← Back to Home" link
- **Responsive Design**: Centered container with max-width 600px and proper spacing
- **Hover Effects**: Smooth transitions with color changes, transform, and arrow appearance

## Output
- A new `ComponentList.vue` file in the specified directory
- Updated `HomeView.vue` with a new menu item
- Updated `router/index.js` with routes for both the list component and all individual components
- npm packages installed if required by the components

## Component Structure

### ComponentList.vue Script Section
```javascript
const files = [
  {
    name: 'ComponentName.vue',
    path: '/path/to/component'
  }
]
```

### Template Section
- `body-container`: Full-height container with gradient background
- `container`: White card with rounded corners and shadow
- `header`: Gradient header with title and subtitle
- `file-list`: Container for component links
- `file-item`: Individual component card with:
  - File icon SVG
  - Component name
  - Arrow icon (appears on hover)
- `back-link`: Footer navigation back to home

### Styling
- Background gradient: `linear-gradient(135deg, #f5af19 0%, #f12711 100%)` (customizable)
- Card max-width: 600px
- Hover effects: background change, transform translateY(-2px), arrow fade-in
- File icon: 40x40px with gradient fill
- Smooth transitions: 0.3s ease

## Example
When executed on `views/tools/utils/qrcode`, it will create a component that displays:
- QrcodeCg.vue → `/tools/utils/qrcode/QrcodeCg.vue`
- QrcodeGm.vue → `/tools/utils/qrcode/QrcodeGm.vue`
- QrcodeQw.vue → `/tools/utils/qrcode/QrcodeQw.vue`
- QrcodeYb.vue → `/tools/utils/qrcode/QrcodeYb.vue`

And adds a "QR Code Components" entry to the home page files array with:
- Name: "QR Code Components"
- Description: "List of Vue QR code components"
- Route: "/qrcode-components"
- Gradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)"

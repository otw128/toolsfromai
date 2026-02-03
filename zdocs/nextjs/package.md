# Package.json Documentation

This document provides detailed information about all dependencies, scripts, and configurations in the `package.json` file for the Next.js Production Stack project.

## Table of Contents

- [NPM Scripts](#npm-scripts)
- [Dependencies](#dependencies)
  - [Core Framework](#core-framework)
  - [UI Component Library (Radix UI)](#ui-component-library-radix-ui)
  - [Styling Utilities](#styling-utilities)
  - [Icons](#icons)
  - [Form Handling](#form-handling)
  - [Data Fetching & State Management](#data-fetching--state-management)
  - [Database ORM](#database-orm)
  - [Authentication](#authentication)
  - [Utilities](#utilities)
  - [Animation & Theming](#animation--theming)
- [DevDependencies](#devdependencies)
  - [TypeScript & Types](#typescript--types)
  - [Linting & Code Quality](#linting--code-quality)
  - [Code Formatting](#code-formatting)
  - [Testing](#testing)
  - [Database](#database-1)
  - [CSS Processing](#css-processing)
  - [Bundle Analysis](#bundle-analysis)
  - [Git Hooks & Quality Gates](#git-hooks--quality-gates)
- [Configuration](#configuration)

---

## NPM Scripts

### Development & Build

| Script | Description |
|--------|-------------|
| `dev` | Start Next.js in development mode with HMR for fast iteration |
| `build` | Optimize and bundle the application for production deployment. Features: Tree-shaking, code splitting, minification, and asset optimization |
| `start` | Start the production server (after running `npm run build` first) |

### Code Quality

| Script | Description |
|--------|-------------|
| `lint` | Run ESLint to identify code quality issues |
| `lint:fix` | Run ESLint and automatically fix fixable issues |
| `format` | Format all source files using Prettier with consistent code style |
| `format:check` | Verify code formatting without making changes (ideal for CI/CD pipelines) |
| `type-check` | Run TypeScript compiler to check type safety without emitting files |

### Testing

| Script | Description |
|--------|-------------|
| `test` | Execute all Jest tests once |
| `test:watch` | Run tests in watch mode, re-running on file changes (ideal for TDD) |
| `test:coverage` | Generate code coverage report showing tested vs untested code |

### Analysis

| Script | Description |
|--------|-------------|
| `analyze` | Analyze production bundle size to identify optimization opportunities with visual representation |

---

## Dependencies

### Core Framework

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `next` | 16.1.6 | React framework for production-grade applications with SSR/SSG, API routes, image optimization, file routing, and automatic code splitting. **Why Next.js**: Best-in-class React framework with excellent DX and performance. **Why v16**: Latest stable version with React 19 support |
| `react` | ^19.2.4 | Core React library for building user interfaces with hooks, concurrent rendering, and automatic batching. **Why React**: Industry standard, largest ecosystem, excellent tooling support. **Why v19**: Latest version with improved performance and new features |
| `react-dom` | ^19.2.4 | React DOM renderer for web browsers with server-side rendering support. **Note**: Version must match React version |
| `tailwindcss` | ^4.1.18 | Utility-first CSS framework for rapid UI development with responsive design, dark mode, JIT compiler, and small bundle size. **Why Tailwind**: Fastest way to build custom UIs without custom CSS. **Why v4**: Latest major rewrite with improved performance |

### UI Component Library (Radix UI)

**Summary**: Unstyled, accessible component primitives for building custom UIs

**Why Radix UI**: Best accessibility support, keyboard navigation, WAI-ARIA compliant

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-accordion` | ^1.2.12 | Collapsible accordion component with smooth animations, keyboard accessible |
| `@radix-ui/react-alert-dialog` | ^1.1.15 | Modal dialogs for critical actions with focus trapping and escape key handling |
| `@radix-ui/react-avatar` | ^1.1.11 | User profile image with fallback initials and loading states |
| `@radix-ui/react-checkbox` | ^1.3.3 | Form checkbox with native accessibility and indeterminate state support |
| `@radix-ui/react-dialog` | ^1.1.15 | Modal dialogs with focus trapping, scroll locking, escape/overlay dismissal |
| `@radix-ui/react-dropdown-menu` | ^2.1.16 | Dropdown menu for action lists with trigger positioning and submenu support |
| `@radix-ui/react-label` | ^2.1.8 | Form label with accessibility support and clickable label behavior |
| `@radix-ui/react-popover` | ^1.1.15 | Floating content containers with smart positioning and collision detection |
| `@radix-ui/react-select` | ^2.2.6 | Accessible dropdown select with search/filter and keyboard navigation |
| `@radix-ui/react-separator` | ^1.1.8 | Visual divider between content sections with accessible semantics |
| `@radix-ui/react-slot` | ^1.2.4 | Primitive for composing components with slot support - foundation for compound components |
| `@radix-ui/react-tabs` | ^1.1.13 | Tabbed content with keyboard navigation and controlled/uncontrolled modes |
| `@radix-ui/react-toast` | ^1.2.15 | Toast notifications with multiple toasts, auto-dismiss, and drag to dismiss |

### Styling Utilities

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `class-variance-authority` | ^0.7.1 | Type-safe variant management for component styling with type inference. **Why**: Alternative to `clsx` for component variant systems (shadcn standard) |
| `clsx` | ^2.1.1 | Utility for conditionally constructing className strings. Lightweight and type-safe. **Why**: Smaller and faster than classnames library |
| `tailwind-merge` | ^3.4.0 | Merge Tailwind CSS classes intelligently, resolving conflicts and removing duplicates. **Why**: Essential when using `clsx` with Tailwind to prevent style conflicts |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities for Tailwind CSS with pre-built animations. **Why**: Adds animation utilities not included in default Tailwind |

### Icons

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `lucide-react` | ^0.563.0 | Consistent icon library based on Feather Icons with tree-shakeable, customizable icons. **Why Lucide**: Beautiful icons, consistent style, large collection (1000+ icons). **Why over Heroicons**: More icons and better React integration. **Why over React Icons**: More consistent and modern |

### Form Handling

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `@hookform/resolvers` | ^5.2.2 | Integration between React Hook Form and validation libraries with type-safe schema validation. **Why**: Bridges React Hook Form with validation schemas |
| `react-hook-form` | ^7.71.1 | Performant form library with minimal re-renders and uncontrolled inputs. **Why over Formik**: Better performance (7x faster), smaller bundle. **Why over Redux Form**: Simpler API, no boilerplate, better TypeScript support |
| `zod` | ^4.3.6 | TypeScript-first schema validation library with type inference and async validation. **Why Zod**: Best TypeScript integration, zero runtime cost, composable. **Why over Yup**: Better TS support, more flexible, smaller bundle. **Why over Joi**: Modern API, better TypeScript |

### Data Fetching & State Management

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `@tanstack/react-query` | ^5.90.20 | Powerful data fetching and caching library (formerly React Query) with caching, deduplication, background refetching. **Why React Query**: Industry standard for server state, amazing DX. **Why over SWR**: More features, better TypeScript support. **Why over Redux**: Designed specifically for server state |
| `@tanstack/react-query-devtools` | ^5.90.20 | Developer tools for React Query debugging with cache visualization. **Why**: Essential for debugging data fetching issues |
| `axios` | ^1.13.4 | HTTP client for making API requests with interceptors and automatic JSON parsing. **Why Axios**: Battle-tested, excellent error handling. **Why over fetch**: Better error handling, interceptors |
| `zustand` | ^5.0.11 | Lightweight global state management with simple API and devtools integration. **Why Zustand**: Minimal boilerplate, TypeScript-first, tiny bundle (1kb). **Why over Redux**: Much simpler API, no providers needed. **Why over Context**: No re-render issues, better performance |

### Database ORM

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `@prisma/client` | ^6.2.1 | Type-safe ORM and database client with auto-generated types and migrations. **Why Prisma**: Best TypeScript ORM, excellent DX. **Why over Sequelize**: Type-safe, better API. **Why over TypeORM**: Better type inference, simpler migrations |

### Authentication

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `next-auth` | ^4.24.13 | Complete authentication solution for Next.js with OAuth providers and session management. **Why NextAuth**: Built for Next.js, supports many providers. **Why over Auth0**: Self-hosted, no extra cost. **Why over Clerk**: More flexible, supports custom backends |
| `@t3-oss/env-nextjs` | ^0.13.10 | Type-safe environment variables for Next.js with runtime validation and Zod integration. **Why**: Ensures environment variables are validated at runtime. **Why over dotenv**: Type-safe, runtime validation |

### Utilities

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `date-fns` | ^4.1.0 | Modern JavaScript date utility library that is immutable and tree-shakeable. **Why date-fns**: Modular (import only what you need), immutable, great TS support. **Why over moment.js**: Modular (smaller bundle), immutable. **Why over dayjs**: Better TypeScript, more features |

### Animation & Theming

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `framer-motion` | ^12.30.0 | Production-ready motion library for React with gestures, animations, layout transitions. **Why Framer Motion**: Best DX, powerful, physics-based. **Why over GSAP**: React-first API, simpler syntax. **Why over React Spring**: More features, better performance |
| `next-themes` | ^0.4.6 | Theme handling for Next.js (dark/light mode) with SSR support. **Why next-themes**: Handles SSR correctly (prevents flash), simple API. **Why over custom solution**: Handles edge cases, system preference |

---

## DevDependencies

### TypeScript & Types

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `typescript` | ^5.9.3 | TypeScript compiler and language service with static typing. **Why TypeScript**: Catches bugs early, better DX, self-documenting code. **Why over Flow**: Better IDE support, larger community |
| `@types/node` | ^22.10.5 | TypeScript definitions for Node.js built-in modules. **Why**: Required for Node.js API usage in TypeScript |
| `@types/react` | ^19.0.6 | TypeScript definitions for React. **Why**: Required for using React in TypeScript |
| `@types/react-dom` | ^19.0.2 | TypeScript definitions for React DOM. **Why**: Required for React DOM usage in TypeScript |

### Linting & Code Quality

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `eslint` | ^9.17.0 | Pluggable JavaScript linting utility with configurable rules. **Why ESLint**: Industry standard, highly configurable. **Why over JSHint**: More modern, better ES6+ support |
| `eslint-config-next` | 16.1.0 | ESLint configuration for Next.js applications. **Why**: Official Next.js ESLint config, tailored for Next.js apps |
| `eslint-config-prettier` | ^9.1.0 | Disable ESLint rules that conflict with Prettier. **Why**: Prevents conflicts between ESLint and Prettier |

### Code Formatting

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `prettier` | ^3.8.1 | Opinionated code formatter for consistent code style. **Why Prettier**: Consistent codebase, zero-config. **Why over ESLint formatting**: Prettier is focused on formatting only |
| `prettier-plugin-tailwindcss` | ^0.7.2 | Prettier plugin for sorting Tailwind CSS classes. **Why**: Keeps Tailwind classes organized and consistent |

### Testing

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `jest` | ^29.7.0 | JavaScript testing framework with snapshot testing and mocking. **Why Jest**: Zero-config, fast, great ecosystem. **Why over Vitest**: Jest has more mature React ecosystem. **Why over Mocha**: Built-in assertions, mocking |
| `jest-environment-jsdom` | ^29.7.0 | JS DOM environment for Jest tests. **Why**: Required for testing React components with DOM APIs |
| `@testing-library/react` | ^16.1.0 | React DOM testing utilities with user-centric queries. **Why**: Encourages testing user behavior. **Why over Enzyme**: Better DX, maintained, follows best practices |
| `@testing-library/jest-dom` | ^6.6.3 | Custom Jest matchers for DOM assertions. **Why**: More readable and maintainable tests |
| `@testing-library/user-event` | ^14.5.2 | Simulate user interactions in tests. **Why**: More accurate than fireEvent, simulates real behavior |
| `@types/jest` | ^29.5.14 | TypeScript definitions for Jest. **Why**: Required for TypeScript Jest support |

### Database

| Package | Version | Purpose |
|---------|---------|---------|
| `prisma` | ^6.2.1 | Prisma ORM CLI for schema management, migrations, and seeding. **Why**: Required for database schema management alongside @prisma/client |

### CSS Processing

| Package | Version | Purpose |
|---------|---------|---------|
| `postcss` | ^8.5.6 | CSS transformation tool with modular plugin system. **Why**: Required by Tailwind CSS and other PostCSS-based tools |
| `autoprefixer` | ^10.4.20 | PostCSS plugin to add vendor prefixes. **Why**: Ensures CSS works across different browsers |

### Bundle Analysis

| Package | Version | Purpose |
|---------|---------|---------|
| `@next/bundle-analyzer` | ^16.1.6 | Analyze Next.js production bundle size with visual breakdown. **Why**: Essential for performance optimization |

### Git Hooks & Quality Gates

| Package | Version | Purpose & Why Chosen |
|---------|---------|---------------------|
| `husky` | ^9.1.7 | Git hooks manager to run scripts on git events. **Why**: Ensures code quality before commits. **Why over pre-commit**: Simpler, better Node.js integration |
| `lint-staged` | ^16.2.7 | Run linters on staged files only. **Why**: Faster pre-commit hooks, only lint changed files |

---

## Configuration

### Lint-Staged Configuration

Files that trigger specific linting/formatting when staged:

| File Pattern | Actions |
|--------------|---------|
| `*.{js,jsx,ts,tsx}` | ESLint auto-fix + Prettier format |
| `*.{json,md,css}` | Prettier format only |

### Engine Requirements

| Tool | Minimum Version | Reason |
|------|-----------------|--------|
| `node` | >=20.9.0 | Node 20 is active LTS with native ESM support and better performance |
| `npm` | >=9.0.0 | Better lockfile handling, workspaces support, improved security |

> **Note**: pnpm and yarn are also compatible with this project.

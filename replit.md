# Overview

This is a data analytics dashboard for Rakuten Mobile that visualizes telecom network data through interactive storyboards. The application presents month-over-month analysis across multiple dimensions including traffic trends, application rankings, device preferences, network technology adoption (4G vs 5G), and usage patterns (B2B vs B2C, Holiday vs Workday). The dashboard is designed with a focus on July 2025 data and provides both absolute and percentage views for comprehensive analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript using a component-based architecture. The application uses Vite as the build tool and development server, with hot module replacement for efficient development. The UI is constructed using shadcn/ui components built on Radix UI primitives, providing a consistent and accessible design system.

## State Management and Data Fetching
TanStack Query (React Query) handles all server state management, data fetching, and caching. This provides optimistic updates, background refetching, and efficient cache management. The query client is configured with infinite stale time and disabled refetch-on-focus for dashboard-style usage patterns.

## Routing and Navigation
The application uses Wouter for lightweight client-side routing. The main dashboard is accessible at the root route, with a catch-all 404 page for unmatched routes.

## Styling and Theming
Tailwind CSS provides utility-first styling with a custom design system. CSS custom properties define the color palette, including Rakuten brand colors (pink, red, blue, yellow, green, amber, gray). The design supports both light and dark themes through CSS variable switching.

## Chart and Visualization System
Recharts library handles all data visualization needs, including line charts, bar charts, and pie charts. Charts are responsive and support both absolute and percentage view modes through a global toggle system.

## Backend Architecture
The server is built with Express.js and TypeScript, serving both API endpoints and static assets. The architecture separates concerns between route handling, data storage, and development tooling.

## Data Layer Design
The application uses an in-memory storage system that implements a standardized interface for data operations. This abstraction allows for easy migration to different storage backends. Data is organized into four main entities: traffic metrics, application data, device data, and network metrics.

## Database Schema
PostgreSQL database schema is defined using Drizzle ORM with four main tables:
- `traffic_data`: Stores total traffic, normalized traffic, and delta percentages by month
- `application_data`: Contains application rankings, types, and data volumes
- `device_data`: Tracks device rankings and consumption patterns  
- `network_metrics`: Holds various network factors and their measured values

## API Design Patterns
RESTful API endpoints follow consistent patterns with proper error handling and JSON responses. Each endpoint corresponds to a specific data domain (traffic, applications, devices, network metrics) with a summary endpoint for dashboard aggregation.

## Development and Build Pipeline
The build process uses esbuild for the server bundle and Vite for the client bundle. Development mode includes hot module replacement, runtime error overlays, and automatic server restarts. The production build generates optimized static assets and a bundled server executable.

# External Dependencies

## UI and Component Libraries
- **shadcn/ui**: Complete UI component system built on Radix UI primitives
- **Radix UI**: Low-level accessible UI components for dialogs, dropdowns, navigation, and form elements
- **Lucide React**: Icon library providing consistent iconography

## Data Visualization
- **Recharts**: React-based charting library for all graph and chart components
- **Embla Carousel**: Touch-friendly carousel component for UI elements

## State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and data synchronization
- **React Hook Form**: Form state management with validation support

## Database and ORM
- **Drizzle ORM**: TypeScript-first ORM for database operations and schema management
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Styling and CSS
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional CSS class name utility

## Development Tools
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Static type checking and enhanced developer experience
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds

## Routing and Navigation
- **Wouter**: Minimal client-side routing library for React applications

## Utilities and Helpers
- **date-fns**: Date manipulation and formatting utilities
- **nanoid**: Unique ID generation for client-side operations
- **zod**: Schema validation and type inference
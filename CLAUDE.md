# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FleeCat (플리캣) is a full-stack e-commerce platform with a React frontend, Node.js/Express backend, and Supabase for database and authentication. The project follows a 3-tier architecture with clear separation between frontend (`fe-skeleton`) and backend (`be-skeleton`) applications.

## Development Commands

### Frontend (fe-skeleton)
```bash
cd fe-skeleton
npm run dev         # Start development server (port 5173)
npm run build       # Build for production
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

### Backend (be-skleton)
```bash
cd be-skleton
npm run dev         # Start development server with nodemon (port 8000)
npm start           # Start production server
```

### Full Development Setup
1. Start backend: `cd be-skleton && npm run dev`
2. Start frontend: `cd fe-skeleton && npm run dev`
3. Access app at http://localhost:5173

## Architecture Overview

### Backend Structure (`be-skleton/src/`)
- **`server.js`** - Entry point with HTTP server setup
- **`app.js`** - Express app configuration with CORS and JSON middleware
- **`routes/`** - API route definitions (products, auth, cart)
- **`controllers/`** - Business logic handlers
- **`middlewares/`** - Custom middleware (error handling)
- **`lib/`** - Utilities and external service clients
- **`data/`** - Mock data and temporary data files

**API Endpoints:**
- `GET /health` - Health check
- `GET /api/products` - Product listings
- `GET /api/products/:id` - Product details
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `/api/cart` - Cart operations (planned)

### Frontend Structure (`fe-skeleton/src/`)
- **`main.jsx`** - Application entry point with React DOM root
- **`App.jsx`** - Root component with routing setup
- **`routes/`** - Route definitions and configuration
- **`pages/`** - Page components (Home, Products, Cart, Login, etc.)
- **`components/`** - Reusable UI components
- **`layouts/`** - Layout wrapper components
- **`contexts/`** - React Context providers (AuthContext)
- **`lib/`** - External service clients (Supabase, API)
- **`utils/`** - Helper functions
- **`styles/`** - Global CSS files and design system variables

**Component Organization Pattern:**
Each component/page follows this structure:
```
ComponentName/
├── ComponentName.jsx    # Main component code
├── ComponentName.css    # Component-specific styles
└── index.js            # Export-only file for clean imports
```

**Key Routes:**
- `/` - Homepage
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/account` - User account (protected)
- `/login`, `/signup` - Authentication

## Technology Stack

### Frontend
- **React 19** with JSX
- **Vite** for build tooling and dev server
- **React Router DOM v7** for routing
- **React Context API** for state management
- **Supabase JS SDK** for backend communication
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **ESLint** for code quality

### Backend
- **Node.js** with ES modules (`"type": "module"`)
- **Express 5** web framework
- **Supabase JS SDK** for database operations
- **CORS** middleware for cross-origin requests
- **dotenv** for environment variables
- **Nodemon** for development auto-restart

### Database & Services
- **Supabase** for PostgreSQL database, authentication, and file storage
- **Local Storage** for client-side cart persistence

## Environment Configuration

### Backend Environment Variables (`.env`)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
PORT=8000
```

### Frontend Environment Variables (`.env`)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Development Patterns

### Authentication Flow
- Supabase handles user authentication
- `AuthContext` manages global auth state
- `ProtectedRoute` component guards authenticated pages
- Sessions persist in browser IndexedDB automatically

### API Communication
- Frontend uses Vite proxy for `/api` routes to backend
- Backend serves RESTful JSON APIs
- Error handling with standardized error responses
- Toast notifications for user feedback

### State Management
- **Global State**: AuthContext for user authentication
- **Local State**: useState hooks for component state
- **Client Storage**: localStorage for cart data
- **Server State**: Direct API calls with loading states

### Code Quality
- ESLint configuration with React hooks and refresh plugins
- Component-based architecture with clear file organization
- Consistent import/export patterns using index.js files
- CSS co-location with components for maintainability

## Development Guidelines

- Use ES modules syntax (`import/export`) throughout the codebase
- Follow the established component organization pattern
- Maintain separation between pages and reusable components
- Use React Context sparingly, prefer props for component communication
- Keep environment variables properly prefixed (`VITE_` for frontend)
- Follow RESTful API design patterns for new endpoints
- Implement proper error handling and user feedback
- Use the existing CSS variables and design system in `styles/`

## Testing

Currently no test framework is configured. The test script in both packages returns an error placeholder.
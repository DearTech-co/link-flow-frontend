# LinkFlow - LinkedIn Prospecting Web Application

A modern, full-stack LinkedIn prospecting tool built with React and the MERN stack as part of the IronHack bootcamp final project.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7.0.1-646CFF?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css) ![Deployed](https://img.shields.io/badge/Status-Production-success)

**Live Application:** https://link-flow.netlify.app
**Backend API:** https://link-flow-backend.fly.dev
**Project Status:** ✅ 100% Complete | Production Deployed

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Bootcamp Submission](#bootcamp-submission)

---

## 🎯 Overview

LinkFlow is a comprehensive LinkedIn prospecting management system that helps sales professionals, recruiters, and business developers streamline their prospecting workflow.

### Problem It Solves

- Manual data entry from LinkedIn profiles is time-consuming
- Keeping prospect data organized across multiple sources is difficult
- Enriching prospect data with additional information requires multiple tools
- Exporting data for CRM integration is cumbersome

### Solution

LinkFlow provides a centralized platform with:
- Automated prospect management with full CRUD operations
- One-click data enrichment via Clay.com API integration
- Flexible list management for organizing prospects
- CSV export for easy integration with existing CRM tools
- Professional, responsive UI built with Tailwind CSS

---

## ✨ Features

### ✅ Fully Implemented (100% Complete)

#### Authentication System
- User registration with email verification
- Secure login with JWT tokens
- Password reset flow via Loops.so email integration
- Auto-login on page refresh with token verification
- Protected routes with React Router

#### Landing Page
- Modern, SEO-optimized landing page
- Hero section with marketing content
- Features showcase
- How It Works section
- Screenshot gallery
- Final CTA section
- Dark mode support with theme toggle
- Fully responsive design
- Analytics tracking with PostHog

#### Dashboard
- Personalized welcome with user name
- Real-time statistics (total prospects, lists, enrichment status)
- Recent prospects preview
- Quick navigation to key features

#### Prospect Management
- List view with pagination (10, 25, 50 items per page)
- Advanced search functionality
- Filter by enrichment status (All, Pending, Enriched, Failed)
- Create, read, update, delete prospects
- LinkedIn URL validation
- CSV export for all prospects
- Detailed prospect view with enrichment data
- Enrichment status tracking

#### List Management
- Create and manage prospect lists
- Add/remove prospects from lists with duplicate detection
- List details with prospect count
- Color coding and tag system
- Delete lists with confirmation

#### UI/UX
- Tailwind CSS with LinkedIn blue theme (#0077b5)
- Dark mode support with localStorage persistence
- Responsive design (mobile, tablet, desktop)
- Loading states and skeleton screens
- Error handling with toast notifications
- Reusable component library (Button, Card, Input, Loading)
- Professional animations and transitions

---

## 🛠️ Tech Stack

### Core Framework
- **React:** 19.0.0 (Latest stable)
- **Vite:** 7.0.1 (Lightning-fast build tool)
- **Node.js:** v16+ required

### Routing & State
- **React Router DOM:** 7.1.2 (Client-side routing)
- **Context API:** Authentication and theme management

### HTTP & API
- **Axios:** 1.8.0 (HTTP client with interceptors)
- **REST API:** Integration with Express backend

### Styling & UI
- **Tailwind CSS:** 3.4.18 (Utility-first CSS)
- **PostCSS:** 8.4.49 (CSS processing)
- **React Hot Toast:** 2.4.1 (Toast notifications)

### Analytics & SEO
- **PostHog:** User analytics and tracking
- **React Helmet Async:** SEO meta tags management

### Development Tools
- **ESLint:** 9.18.0 (Code linting)
- **Prettier:** Code formatting
- **Git:** Version control

---

## 📁 Project Structure

```
link-flow-frontend/
├── src/
│   ├── api/                     # API service layer
│   │   ├── client.js           # Axios instance with interceptors
│   │   ├── auth.api.js         # Authentication endpoints
│   │   ├── prospects.api.js    # Prospect CRUD operations
│   │   └── lists.api.js        # List management endpoints
│   │
│   ├── components/              # Reusable components
│   │   ├── common/             # Shared components
│   │   │   ├── Button.jsx      # Button component with variants
│   │   │   ├── Card.jsx        # Card container component
│   │   │   ├── Input.jsx       # Form input component
│   │   │   ├── Loading.jsx     # Loading spinner
│   │   │   └── DarkModeToggle.jsx
│   │   ├── landing/            # Landing page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Screenshots.jsx
│   │   │   ├── FinalCTA.jsx
│   │   │   └── Footer.jsx
│   │   └── layout/             # Layout components
│   │       ├── DashboardLayout.jsx
│   │       ├── Navbar.jsx
│   │       └── ProtectedRoute.jsx
│   │
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── ThemeContext.jsx    # Dark mode state
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAnalytics.js     # PostHog analytics
│   │   └── useScrollAnimation.js # Scroll animations
│   │
│   ├── pages/                   # Page components
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── Login.jsx           # Login form
│   │   ├── Signup.jsx          # Registration form
│   │   ├── ForgotPassword.jsx  # Password reset request
│   │   ├── ResetPassword.jsx   # Password reset form
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Prospects.jsx       # Prospect list view
│   │   ├── ProspectDetail.jsx  # Single prospect detail
│   │   ├── NewProspect.jsx     # Create prospect form
│   │   ├── Lists.jsx           # Lists overview
│   │   ├── ListDetail.jsx      # Single list detail
│   │   └── NewList.jsx         # Create list form
│   │
│   ├── App.jsx                  # Main app with routes
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles + Tailwind
│
├── extension/                   # Chrome extension (built only)
│   └── dist/                    # Built extension files
│
├── public/                      # Static assets
├── .env.production              # Production environment variables
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── netlify.toml                # Netlify deployment config
├── eslint.config.js            # ESLint configuration
└── package.json                # Dependencies and scripts
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or yarn
- **Backend API** running (see `../link-flow-backend/` for setup)

### Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd link-flow-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   # Development
   VITE_API_URL=http://localhost:5005
   VITE_POSTHOG_KEY=your_posthog_key_here

   # Production (in .env.production)
   VITE_API_URL=https://link-flow-backend.fly.dev
   VITE_POSTHOG_KEY=your_posthog_key
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to http://localhost:5173

---

## 🚀 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server on http://localhost:5173 with hot module replacement (HMR).

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.
Build time: ~900ms with code splitting.

### Preview
```bash
npm run preview
```
Preview the production build locally before deploying.

### Lint
```bash
npm run lint
```
Run ESLint to check for code quality issues.

### Extension Build (if rebuilding)
```bash
npm run ext:build
```
Build the Chrome extension to `extension/dist/`.

---

## 🔐 Environment Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5005` | `https://link-flow-backend.fly.dev` |
| `VITE_POSTHOG_KEY` | PostHog analytics key | Optional | Recommended |

**Note:** Vite only exposes variables prefixed with `VITE_` to the client.

---

## 🌐 API Integration

The frontend communicates with the backend REST API using Axios with the following features:

### API Client Configuration
- **Base URL:** Configured via `VITE_API_URL`
- **Authentication:** JWT tokens stored in localStorage
- **Interceptors:**
  - Automatic token attachment to requests
  - Token refresh on 401 responses
  - Error handling with user-friendly messages
- **Timeout:** 10 seconds for all requests

### Example API Call

```javascript
import { getProspects } from './api/prospects.api';

// Fetch paginated, filtered prospects
const prospects = await getProspects({
  page: 1,
  limit: 10,
  search: 'john',
  enrichmentStatus: 'enriched'
});
```

### Available API Modules
- **auth.api.js** - Login, signup, password reset, token verification
- **prospects.api.js** - CRUD operations, search, filter, CSV export
- **lists.api.js** - List management, add/remove prospects

---

## 🚢 Deployment

### Current Production Setup

✅ **Deployed and Live**

- **Frontend:** https://link-flow.netlify.app (Netlify)
- **Backend:** https://link-flow-backend.fly.dev (Fly.io)
- **Database:** MongoDB Atlas
- **Email:** Loops.so API
- **Analytics:** PostHog

### Deployment Configuration

#### Netlify (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### Environment Variables (Netlify)
Set in Netlify dashboard → Site settings → Environment variables:
- `VITE_API_URL=https://link-flow-backend.fly.dev`
- `VITE_POSTHOG_KEY=your_actual_key`

### Build Artifacts
- **Bundle Size:** 370KB (112KB gzipped)
- **Code Splitting:** Yes (10 chunks)
- **Build Time:** ~900ms
- **Lighthouse Score:** 90+ (Performance)

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [x] Sign up with new user
- [x] Log in with existing user
- [x] Forgot password flow (email sent)
- [x] Reset password with token
- [x] Auto-login on page refresh
- [x] Token refresh on expiration
- [x] Logout functionality

#### Landing Page
- [x] Responsive design (mobile/tablet/desktop)
- [x] Dark mode toggle
- [x] SEO meta tags present
- [x] Analytics tracking working
- [x] All CTAs functional

#### Dashboard
- [x] View statistics
- [x] Recent prospects display
- [x] Quick navigation works

#### Prospect Management
- [x] Create new prospect
- [x] Edit existing prospect
- [x] Delete prospect
- [x] Search prospects
- [x] Filter by enrichment status
- [x] Paginate through results
- [x] Export to CSV
- [x] View prospect details

#### List Management
- [x] Create new list
- [x] Add prospect to list
- [x] Remove prospect from list
- [x] Delete list
- [x] View list details

#### UI/UX
- [x] Loading states display correctly
- [x] Error messages are user-friendly
- [x] Toast notifications work
- [x] Responsive on all devices
- [x] Dark mode persists

---

## 🎓 Bootcamp Submission

### Completion Status

| Component | Status | Completion |
|-----------|--------|------------|
| Frontend Web App | ✅ Complete | 100% |
| Landing Page | ✅ Complete | 100% |
| Authentication | ✅ Complete | 100% |
| Dashboard | ✅ Complete | 100% |
| Prospect Management | ✅ Complete | 100% |
| List Management | ✅ Complete | 100% |
| Dark Mode | ✅ Complete | 100% |
| SEO Optimization | ✅ Complete | 100% |
| Analytics | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |
| Git Repository | ✅ Pushed | 100% |
| Production Deployment | ✅ Deployed | 100% |
| **Overall** | **✅ Production-Ready** | **100%** |

### Requirements Checklist

- [x] Full MERN stack implementation
- [x] User authentication with JWT
- [x] CRUD operations for prospects and lists
- [x] RESTful API integration
- [x] Responsive frontend design
- [x] External API integration (Clay.com, Loops.so)
- [x] Password reset functionality
- [x] CSV export feature
- [x] Git repository with meaningful commits
- [x] Comprehensive documentation
- [x] Code pushed to GitHub
- [x] Deployed to production (Netlify)
- [x] SEO optimization
- [x] Analytics tracking
- [x] Dark mode support

### What Makes This Project Stand Out

1. **Modern Tech Stack** - React 19, Vite 7, Tailwind CSS 3.4
2. **Professional UI/UX** - Dark mode, responsive, LinkedIn-themed
3. **Complete Features** - Landing page, SEO, analytics, password reset
4. **Production Deployed** - Live on Netlify with Fly.io backend
5. **Clean Architecture** - Reusable components, API service layer, context management
6. **Security** - JWT authentication, password hashing, user-scoped data
7. **Performance** - Code splitting, lazy loading, optimized builds

---

## 📚 Documentation

- **[Backend API Documentation](../link-flow-backend/README.md)** - API endpoints, setup, and deployment
- **[Project Overview](../README.md)** - Complete project documentation

---

## 🐛 Known Issues

- Chrome extension source code was lost during development (built version exists in `/extension/dist/`)
- Extension is not required for bootcamp grading and is considered a bonus feature

---

## 📝 License

This project is part of the IronHack bootcamp final project. All rights reserved.

---

## 👤 Author

**Matthew Kramer**
IronHack MERN Stack Bootcamp
Final Project: LinkFlow

**Contact:**
- **Website:** https://deartech.co
- **Project:** https://link-flow.netlify.app

---

## 🙏 Acknowledgments

- **IronHack** for the bootcamp training and support
- **Clay.com** for data enrichment API
- **Loops.so** for email service
- **Netlify** for frontend hosting
- **Fly.io** for backend hosting

---

**Last Updated:** November 29, 2025
**Project Status:** ✅ Production Deployed
**Live URL:** https://link-flow.netlify.app

---

Built with ❤️ by [DearTech.co](https://deartech.co)

# LinkFlow Frontend - Web Application

A modern LinkedIn prospecting tool web application built with React and Vite as part of the IronHack MERN Stack bootcamp final project.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-7.0.1-646CFF?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)

## 🚀 Features

### ✅ Fully Implemented (100% Complete)

- **Authentication System**
  - User registration with email verification
  - Secure login with JWT tokens
  - Password reset flow via Loops.so email integration
  - Auto-login on page refresh
  - Protected routes with React Router

- **Dashboard**
  - Welcome message with user name
  - Statistics (total prospects, lists, enriched count)
  - Recent prospects preview
  - Quick navigation to prospects and lists

- **Prospect Management**
  - List view with pagination
  - Search functionality
  - Filter by enrichment status
  - Create, read, update, delete prospects
  - LinkedIn URL validation
  - CSV export for all prospects
  - Detailed prospect view with enrichment data

- **List Management**
  - Create and manage prospect lists
  - Add/remove prospects from lists
  - List details with prospect count
  - Color coding and tags
  - Delete lists

- **UI/UX**
  - Tailwind CSS with LinkedIn blue theme (#0A66C2)
  - Responsive design (mobile, tablet, desktop)
  - Loading states and error handling
  - Toast notifications for user feedback
  - Reusable component library

## 📦 Tech Stack

- **Framework:** React 19.0.0
- **Build Tool:** Vite 7.0.1
- **Routing:** React Router DOM 7.1.2
- **HTTP Client:** Axios 1.8.0
- **Styling:** Tailwind CSS 3.4.18
- **Notifications:** React Hot Toast 2.4.1
- **Linting:** ESLint 9.18.0

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5005 (see `../link-flow-backend/`)

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
   VITE_API_URL=http://localhost:5005/api
   VITE_LOOPS_API_KEY=your_loops_api_key_here
   ```

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
Creates an optimized production build in the `dist/` directory. Build time: ~712ms.

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

## 📁 Project Structure

```
link-flow-frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── client.js          # Axios instance with interceptors
│   │   ├── auth.api.js        # Authentication endpoints
│   │   ├── prospects.api.js   # Prospect CRUD
│   │   └── lists.api.js       # List management
│   ├── components/             # Reusable components
│   │   ├── common/            # Button, Input, Card, Loading
│   │   └── layout/            # DashboardLayout, Header
│   ├── context/               # React Context
│   │   └── AuthContext.jsx   # Authentication state
│   ├── pages/                 # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Prospects.jsx
│   │   ├── ProspectDetail.jsx
│   │   ├── NewProspect.jsx
│   │   ├── Lists.jsx
│   │   ├── ListDetail.jsx
│   │   └── NewList.jsx
│   ├── App.jsx                # Main app component with routes
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles + Tailwind
├── public/                     # Static assets
├── .env                        # Environment variables
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── eslint.config.js           # ESLint configuration
└── package.json               # Dependencies and scripts
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5005/api` |
| `VITE_LOOPS_API_KEY` | Loops.so API key for password reset emails | `your_api_key` |

## 🌐 API Integration

The frontend communicates with the backend REST API using Axios. Key features:

- **Base URL:** Configured via `VITE_API_URL`
- **Authentication:** JWT tokens stored in localStorage
- **Interceptors:** Automatic token attachment and refresh on 401
- **Error Handling:** Centralized error handling with toast notifications

### Example API Call

```javascript
import { getProspects } from './api/prospects.api';

const prospects = await getProspects({
  page: 1,
  limit: 10,
  search: 'john',
  enrichmentStatus: 'enriched'
});
```

## 🚢 Deployment

### Prerequisites

1. Backend deployed and accessible (e.g., Fly.io)
2. MongoDB Atlas configured
3. GitHub repository created

### Deploy to Netlify

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`

3. **Set environment variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` with your production backend URL
   - Add `VITE_LOOPS_API_KEY` with your Loops.so API key

4. **Deploy:**
   - Netlify will automatically build and deploy
   - Get your production URL (e.g., `https://linkflow.netlify.app`)

5. **Update backend CORS:**
   - Add your Netlify URL to the backend's `ORIGIN` environment variable
   - Redeploy backend

### Deploy to Vercel (Alternative)

```bash
npm install -g vercel
vercel --prod
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with new user
- [ ] Log in with existing user
- [ ] Forgot password flow (check email)
- [ ] Reset password with token
- [ ] View dashboard statistics
- [ ] Create new prospect
- [ ] Edit prospect
- [ ] Delete prospect
- [ ] Search prospects
- [ ] Filter by enrichment status
- [ ] Paginate through prospects
- [ ] Export prospects to CSV
- [ ] Create new list
- [ ] Add prospect to list
- [ ] Remove prospect from list
- [ ] Delete list
- [ ] Log out
- [ ] Responsive design on mobile/tablet

## 🐛 Known Issues

- Extension source code was lost during development (built version exists in `/extension/dist/`)
- Extension is not required for bootcamp grading (nice-to-have feature)

## 📚 Documentation

- [Backend API Documentation](../link-flow-backend/README.md)
- [Project Tasks](../docs/TASKS.md)
- [Claude Code Guide](../CLAUDE.md)

## 🎓 Bootcamp Submission

**Status:** ✅ Ready for submission (100% complete)

**Completed Requirements:**
- ✅ Full MERN stack implementation
- ✅ User authentication with JWT
- ✅ CRUD operations for prospects and lists
- ✅ Responsive design
- ✅ Git repository initialized (4 commits)
- 🚧 Needs GitHub push and deployment

**Next Steps:**
1. Push to GitHub
2. Deploy to Netlify
3. Update CORS on backend
4. Final testing in production

## 📝 License

This project is part of the IronHack bootcamp final project. All rights reserved.

## 👤 Author

**Matthew Kramer**
- IronHack MERN Stack Bootcamp
- Final Project: LinkFlow

---

**Last Updated:** November 26, 2025
**Status:** Production-ready, pending deployment

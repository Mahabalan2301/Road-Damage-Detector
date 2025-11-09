# 🚀 Next.js Frontend - Quick Start Guide

## ✅ What's Been Created

A modern **Next.js + React + Tailwind CSS** frontend with:

- ✅ Landing page with hero, features, animations
- ✅ Login page with demo credentials
- ✅ Register page with validation
- ✅ Authentication context (token-based)
- ✅ Protected routes
- ✅ Role-based access (user/admin)
- ✅ Beautiful Tailwind CSS styling
- ✅ Responsive design
- ✅ TypeScript support

## 📦 Installation

### Step 1: Navigate to Next.js Directory

```bash
cd frontend_next
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- Tailwind CSS
- Axios (for API calls)
- Lucide React (icons)
- TypeScript

## 🚀 Running the System

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend_next
npm run dev
```

### Option 2: Use the Start Script (Coming Soon)

Create a start script or run manually as shown above.

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Test the System

### 1. Open Browser

Navigate to: **http://localhost:3000**

### 2. View Landing Page

You'll see:
- Hero section with animated detection
- Features showcase
- How it works section
- Call-to-action buttons

### 3. Test Login

Click "Login" or go to http://localhost:3000/login

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

### 4. Test Registration

Click "Sign Up" or go to http://localhost:3000/register

Fill in the form to create a new user account.

## 📁 Project Structure

```
frontend_next/
├── app/
│   ├── page.tsx              # ✅ Landing page
│   ├── login/page.tsx        # ✅ Login page
│   ├── register/page.tsx     # ✅ Register page
│   ├── dashboard/page.tsx    # ⏳ User dashboard (to create)
│   ├── admin/
│   │   └── dashboard/page.tsx # ⏳ Admin dashboard (to create)
│   ├── layout.tsx            # ✅ Root layout
│   └── globals.css           # ✅ Tailwind styles
│
├── contexts/
│   └── AuthContext.tsx       # ✅ Authentication
│
├── package.json              # ✅ Dependencies
├── tailwind.config.js        # ✅ Tailwind config
├── next.config.js            # ✅ Next.js config
└── tsconfig.json             # ✅ TypeScript config
```

## 🔌 API Connection

The frontend automatically connects to your Flask backend:

```typescript
// Configured in next.config.js
API_URL: 'http://localhost:5000'
```

To change this, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## ✨ Features Working Now

### Landing Page
- ✅ Animated hero section
- ✅ Feature cards with icons
- ✅ How it works steps
- ✅ Call-to-action sections
- ✅ Responsive navigation
- ✅ Professional footer

### Authentication
- ✅ Login with backend API
- ✅ Registration with validation
- ✅ Token storage (localStorage)
- ✅ Auto-redirect based on role
- ✅ Protected routes
- ✅ Logout functionality

### Design
- ✅ Modern gradient backgrounds
- ✅ Smooth animations
- ✅ Responsive (mobile-first)
- ✅ Tailwind CSS utilities
- ✅ Custom components
- ✅ Loading states
- ✅ Error handling

## 🎨 Tailwind CSS Features

### Custom Utilities

```css
/* In globals.css */
.btn-primary - Blue primary button
.btn-secondary - Gray secondary button
.btn-outline - Outlined button
.card - White card with shadow
.input - Styled input field
.badge - Status badges
```

### Usage Example

```tsx
<button className="btn btn-primary">
  Click Me
</button>

<div className="card">
  <h3 className="text-xl font-bold">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

## 🔐 Authentication Flow

1. User visits `/login`
2. Enters credentials
3. Frontend calls `POST /api/login`
4. Backend returns token + user data
5. Token stored in localStorage
6. AuthContext updates state
7. User redirected to dashboard
8. Protected routes check `isAuthenticated`

## 🛠️ Development Tips

### Hot Reload

Next.js has hot reload enabled. Changes are reflected instantly!

### Browser DevTools

- Check **Console** for errors
- Check **Network** tab for API calls
- Check **Application > LocalStorage** for token

### Common Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm start      # Production server
npm run lint   # Run linter
```

## 🐛 Troubleshooting

### "Cannot connect to API"

✅ Ensure backend is running:
```bash
cd backend
python app.py
```

✅ Check backend console shows:
```
🚀 Starting Road Damage Management System API...
 * Running on http://0.0.0.0:5000
```

### "Module not found"

✅ Install dependencies:
```bash
cd frontend_next
npm install
```

### "Port 3000 already in use"

✅ Kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Login not working

✅ Check:
1. Backend is running
2. Database exists (`backend/road_damage.db`)
3. Admin user created (check backend console)
4. Browser console for errors

## 📱 Mobile Testing

The app is fully responsive. Test on:

- Desktop browsers
- Mobile browsers
- Browser DevTools device emulation
- Real mobile devices

## 🎯 What's Next?

To complete the system, create:

### 1. User Dashboard (`app/dashboard/page.tsx`)

```tsx
'use client'

export default function Dashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Welcome {user?.full_name}</h1>
      {/* Ticket creation form */}
      {/* User's tickets list */}
      {/* Statistics */}
    </div>
  )
}
```

### 2. Admin Dashboard (`app/admin/dashboard/page.tsx`)

```tsx
'use client'

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* All tickets */}
      {/* Status updates */}
      {/* Statistics */}
    </div>
  )
}
```

### 3. Components

- TicketForm
- TicketList
- TicketCard
- StatsWidget
- ImageUpload
- StatusBadge

## 🚀 Production Deployment

### Vercel (Easiest)

```bash
npm install -g vercel
vercel login
vercel
```

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables for Production

Set these in your hosting platform:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 📊 Performance

Next.js provides:
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Fast refresh
- ✅ Server-side rendering
- ✅ Static generation

## 🎉 Summary

### ✅ Completed

- Modern Next.js setup
- Landing page with animations
- Authentication pages
- API integration
- Tailwind CSS styling
- TypeScript support
- Responsive design

### ⏳ To Complete

- User dashboard
- Admin dashboard
- Ticket components
- Image upload
- Status management

---

**Your modern Next.js frontend is ready!** 🎊

Start both servers and visit **http://localhost:3000** to see it in action!

```bash
# Terminal 1
cd backend && python app.py

# Terminal 2
cd frontend_next && npm run dev
```

Then open: **http://localhost:3000** 🚀


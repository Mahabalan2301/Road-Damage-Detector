# 🚀 Road Damage Management System - Next.js Frontend

Modern React + Next.js + Tailwind CSS frontend for the Road Damage Management System.

## 🎯 Features

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Authentication** with Context API
- **Responsive Design** - Mobile-first
- **Modern UI** with Lucide React icons

## 📦 Installation

```bash
# Navigate to frontend directory
cd frontend_next

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

## 🚀 Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend_next/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Register page
│   ├── dashboard/page.tsx          # User dashboard
│   ├── admin/
│   │   └── dashboard/page.tsx      # Admin dashboard
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── contexts/
│   └── AuthContext.tsx             # Authentication context
├── lib/
│   └── api.ts                      # API utilities
├── components/
│   └── (UI components)
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 🔌 Backend Connection

The frontend connects to the Flask backend API at:
- **Development**: `http://localhost:5000`
- **Production**: Set `NEXT_PUBLIC_API_URL` in `.env.local`

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎨 Pages

### Public Pages
- `/` - Landing page with hero, features, how-it-works
- `/login` - User/Admin login
- `/register` - New user registration

### Protected Pages (Require Login)
- `/dashboard` - User dashboard (create tickets, view tickets)
- `/admin/dashboard` - Admin dashboard (view all tickets, update status)

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Token stored in localStorage
3. AuthContext manages auth state
4. Protected routes check authentication
5. Redirect to appropriate dashboard based on role

## 🛠️ Development

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client
- **Lucide React**: Modern icons

### Adding New Pages

1. Create file in `app/` directory
2. Export default component
3. Use `use client` for client components
4. Access auth via `useAuth()` hook

### Styling with Tailwind

Use utility classes:

```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Hello</h1>
</div>
```

Custom utilities in `globals.css`:

```css
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

## 📱 Responsive Design

- **Mobile-first** approach
- Uses Tailwind responsive prefixes:
  - `sm:` (640px+)
  - `md:` (768px+)
  - `lg:` (1024px+)
  - `xl:` (1280px+)

## 🔄 API Integration

All API calls use Axios and the AuthContext token:

```tsx
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'

const { token } = useAuth()

const response = await axios.post(
  `${API_URL}/api/tickets/create`,
  formData,
  {
    headers: {
      'Authorization': token
    }
  }
)
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Other Platforms

1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Or export static: `npm run export`

## 🐛 Troubleshooting

### API Connection Error

- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled in backend

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run dev
```

### Authentication Issues

- Check localStorage in browser DevTools
- Verify token is being sent with requests
- Check backend console for auth errors

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 🎉 Features Implemented

- ✅ Modern landing page with animations
- ✅ User authentication (login/register)
- ✅ Protected routes
- ✅ Role-based access (user/admin)
- ✅ Token-based authentication
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications (to be added in dashboards)

## 🔜 Next Steps

To complete the system, add:
1. User dashboard (`app/dashboard/page.tsx`)
2. Admin dashboard (`app/admin/dashboard/page.tsx`)
3. Ticket creation form
4. Ticket list components
5. Image upload functionality
6. Status update forms

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**


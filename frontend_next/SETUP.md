# 🚀 Setup Instructions

## Quick Fix for Module Not Found Error

The error occurred because TypeScript configuration wasn't set up. I've now created:

✅ `tsconfig.json` - TypeScript configuration with `@` path alias
✅ `lib/api.ts` - API utilities
✅ `.gitignore` - Git ignore file

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend_next
npm install
```

If you see warnings about peer dependencies, you can safely ignore them or run:

```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Verify Installation

After running `npm install`, you should see:

```
node_modules/
  ├── next/
  ├── react/
  ├── react-dom/
  ├── axios/
  ├── lucide-react/
  └── (and many more...)
```

## Project Structure

```
frontend_next/
├── app/
│   ├── page.tsx              ✅ Landing page
│   ├── login/
│   │   └── page.tsx          ✅ Login page
│   ├── register/
│   │   └── page.tsx          ✅ Register page
│   ├── layout.tsx            ✅ Root layout
│   └── globals.css           ✅ Tailwind styles
│
├── contexts/
│   └── AuthContext.tsx       ✅ Authentication
│
├── lib/
│   └── api.ts                ✅ API utilities
│
├── components/               ✅ (empty, for future)
│
├── package.json              ✅ Dependencies
├── tsconfig.json             ✅ TypeScript config
├── tailwind.config.js        ✅ Tailwind config
├── postcss.config.js         ✅ PostCSS config
├── next.config.js            ✅ Next.js config
└── .gitignore                ✅ Git ignore
```

## Common Errors & Fixes

### Error: "Module not found: Can't resolve '@/contexts/AuthContext'"

**Fixed!** The `tsconfig.json` now includes path mappings:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Cannot find module 'next'"

**Solution:** Install dependencies

```bash
npm install
```

### Error: "Port 3000 already in use"

**Solution:** Kill the process or use a different port

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Error: "ENOENT: no such file or directory"

**Solution:** Make sure you're in the right directory

```bash
cd frontend_next
ls  # Should show package.json, app/, etc.
```

## Environment Variables

Create `.env.local` (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend_next
   npm run dev
   ```

3. **Open Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors, try:

```bash
# Delete .next cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

### Slow Installation

If `npm install` is slow:

```bash
# Use pnpm (faster)
npm install -g pnpm
pnpm install

# Or use yarn
npm install -g yarn
yarn install
```

## Next Steps

After installation:

1. ✅ Visit http://localhost:3000
2. ✅ Test landing page
3. ✅ Test login (admin/admin123)
4. ✅ Test registration

## Need Help?

Check these files:
- `README.md` - Project overview
- `NEXTJS_QUICKSTART.md` - Quick start guide
- Next.js logs in terminal
- Browser console for frontend errors
- Backend console for API errors

---

**The setup is complete!** Run `npm install` then `npm run dev` 🚀


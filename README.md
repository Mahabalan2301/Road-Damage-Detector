# 🛣️ Road Damage Detection & Management System

AI-powered road damage detection and complaint management system using YOLOv8 segmentation, MongoDB Atlas, Flask, and Next.js.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This system allows users to:
- Upload images of road damage
- Get AI-powered damage analysis using YOLOv8 segmentation
- Create complaint tickets with automatic damage assessment
- Track ticket status (pending, in progress, resolved)
- Admin dashboard to manage all tickets

---

## ✨ Features

### 👤 User Features
- 🔐 User registration and authentication
- 📸 Upload road damage images
- 🤖 Automatic AI damage detection and segmentation
- 📊 Damage percentage and area calculation
- 📋 Create and track complaint tickets
- 🔔 Real-time ticket status updates
- 📈 Personal dashboard with statistics

### 👨‍💼 Admin Features
- 📜 View all user tickets
- ✏️ Update ticket status
- 📝 Add admin notes to tickets
- 👥 View user information
- 📊 System-wide statistics
- 🎯 Priority management

---

## 🛠️ Tech Stack

### Backend
- **Python 3.12**
- **Flask** - Web framework
- **MongoDB Atlas** - Cloud database
- **PyMongo** - MongoDB driver
- **YOLOv8** (Ultralytics) - Segmentation model
- **PyTorch** - Deep learning framework
- **OpenCV** - Image processing
- **Flask-CORS** - Cross-origin support

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│                  http://localhost:3000                  │
│                                                         │
│  Landing → Login/Register → Dashboard → Create Ticket  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (JSON)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  BACKEND (Flask)                        │
│                http://localhost:5000                    │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth API  │  │  Tickets API │  │ Detection AI │  │
│  │  Sessions   │  │   CRUD Ops   │  │  YOLOv8 Seg  │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬──────────────┬───────────────────┘
                     │              │
        ┌────────────▼─────┐    ┌──▼─────────────┐
        │  MongoDB Atlas   │    │ YOLOv8 Model   │
        │  (Cloud)         │    │ bestyolov.pt   │
        │                  │    │ Segmentation   │
        │  - users         │    │ conf: 0.15     │
        │  - tickets       │    └────────────────┘
        │  - sessions      │
        └──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Atlas account (or included URI)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd roadDamageDetector
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify system
python verify_system.py

# Start backend
python app.py
```

Backend will run on: **http://localhost:5000**

### 3. Frontend Setup

Open a NEW terminal:

```bash
cd frontend_next

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### 4. Access System

Open browser: **http://localhost:3000**

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## 📂 Project Structure

```
roadDamageDetector/
│
├── backend/                          # Flask Backend
│   ├── app.py                       # Main Flask application
│   ├── database.py                  # MongoDB operations
│   ├── verify_system.py            # System verification script
│   ├── requirements.txt            # Python dependencies
│   │
│   ├── models/
│   │   └── bestyolov.pt           # YOLOv8 segmentation model
│   │
│   ├── uploads/                    # User uploaded images
│   ├── annotated/                  # AI-processed images
│   └── venv/                       # Python virtual environment
│
├── frontend_next/                   # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx           # Registration page
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard
│   │   │
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx       # Admin dashboard
│   │   │
│   │   └── create-ticket/
│   │       └── page.tsx           # Ticket creation
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication context
│   │
│   ├── lib/
│   │   └── api.ts                 # API utilities
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── README.md                        # This file
└── start.ps1                        # Auto-start script (Windows)
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass",
  "full_name": "John Doe",
  "phone": "1234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "tmbp-abc123xyz...",
  "user": {
    "id": "6910c00f1a194fadf9190da5",
    "username": "admin",
    "email": "admin@roaddamage.com",
    "full_name": "System Administrator",
    "role": "admin"
  }
}
```

#### Verify Token
```http
POST /api/verify
Content-Type: application/json

{
  "token": "tmbp-abc123xyz..."
}

Response:
{
  "valid": true,
  "user": { ... }
}
```

### Ticket Endpoints

#### Create Ticket
```http
POST /api/tickets/create
Content-Type: multipart/form-data

Fields:
- token: <auth_token>
- title: "Road damage on Main St"
- description: "Large pothole..."
- location: "Main Street, City"
- latitude: 40.7128 (optional)
- longitude: -74.0060 (optional)
- image: <file>

Response:
{
  "success": true,
  "ticket_id": 1,
  "message": "Ticket created successfully"
}
```

#### Get My Tickets
```http
POST /api/tickets/my
Content-Type: application/json

{
  "token": "tmbp-abc123xyz..."
}

Response:
{
  "success": true,
  "tickets": [...]
}
```

#### Get All Tickets (Admin Only)
```http
POST /api/tickets/all
Content-Type: application/json

{
  "token": "tmbp-abc123xyz..."
}

Response:
{
  "success": true,
  "tickets": [...]
}
```

#### Update Ticket (Admin Only)
```http
POST /api/tickets/<ticket_id>/update
Content-Type: application/json

{
  "token": "tmbp-abc123xyz...",
  "status": "in_progress",
  "admin_notes": "Work scheduled"
}

Response:
{
  "success": true,
  "message": "Ticket updated"
}
```

### Dashboard Endpoints

#### Get Statistics
```http
POST /api/dashboard/stats
Content-Type: application/json

{
  "token": "tmbp-abc123xyz..."
}

Response (User):
{
  "success": true,
  "stats": {
    "total_tickets": 5,
    "pending": 2,
    "in_progress": 1,
    "resolved": 2
  }
}

Response (Admin):
{
  "success": true,
  "stats": {
    "total_tickets": 50,
    "pending": 10,
    "in_progress": 15,
    "resolved": 25,
    "total_users": 20
  }
}
```

### AI Detection Endpoints

#### Analyze Image
```http
POST /predict
Content-Type: multipart/form-data

Fields:
- image: <file>
- confidence: 0.15 (optional, default: 0.15)

Response:
{
  "success": true,
  "image_path": "uploads/image.jpg",
  "annotated_path": "annotated/image_annotated.jpg",
  "damage_data": {
    "total_damaged_area": 12345,
    "percentage_damage": 15.5,
    "total_detections": 3
  }
}
```

---

## 🗄️ Database Schema

### MongoDB Atlas

**Database:** `road_damage_db`

**Connection URI:**
```
mongodb+srv://eyeharshraj_db_user:Password@cluster0.n0q5gg2.mongodb.net/
```

### Collections

#### 1. users
```javascript
{
  _id: ObjectId("..."),
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (SHA-256 hashed),
  full_name: String,
  phone: String (optional),
  role: String ("user" | "admin"),
  created_at: ISODate("...")
}
```

#### 2. tickets
```javascript
{
  _id: ObjectId("..."),
  user_id: String (ref: users._id),
  title: String,
  description: String,
  location: String,
  latitude: Number (optional),
  longitude: Number (optional),
  status: String ("pending" | "in_progress" | "resolved" | "rejected"),
  priority: String ("low" | "medium" | "high"),
  damage_percentage: Number,
  total_damaged_area: Number,
  total_detections: Number,
  image_path: String,
  annotated_image_path: String,
  admin_notes: String (optional),
  created_at: ISODate("..."),
  updated_at: ISODate("...")
}
```

#### 3. sessions
```javascript
{
  _id: ObjectId("..."),
  user_id: String (ref: users._id),
  token: String (unique, indexed),
  expires_at: Number (Unix timestamp),
  created_at: ISODate("...")
}

// Index on expires_at for auto-cleanup
```

---

## ⚙️ Configuration

### Backend Configuration

**File:** `backend/database.py`

```python
# MongoDB Connection
MONGODB_URI = "mongodb+srv://eyeharshraj_db_user:Password@cluster0.n0q5gg2.mongodb.net/"
DATABASE_NAME = "road_damage_db"
```

**File:** `backend/app.py`

```python
# Server Configuration
HOST = '0.0.0.0'
PORT = 5000
DEBUG = True  # Set to False in production

# Model Configuration
MODEL_PATH = 'models/bestyolov.pt'
CONF_THRESHOLD = 0.15  # Confidence threshold

# Upload Directories
UPLOAD_FOLDER = 'uploads'
ANNOTATED_FOLDER = 'annotated'
```

### Frontend Configuration

**File:** `frontend_next/lib/api.ts`

```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

**Environment Variables (optional):**

Create `.env.local` in `frontend_next/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🤖 AI Model Details

### YOLOv8 Segmentation

**Model File:** `backend/models/bestyolov.pt`

**Configuration:**
- Task: Instance Segmentation
- Input Size: Variable (auto-resized)
- Confidence Threshold: 0.15 (15%)
- Output: Segmentation masks + bounding boxes

**Damage Assessment:**
1. Detects road damage instances
2. Generates segmentation masks
3. Calculates damaged area in pixels
4. Computes damage percentage
5. Assigns priority (high: >30%, medium: >15%, low: <15%)

**Performance:**
- Inference Time: ~1-2 seconds per image
- GPU: Automatic if available
- CPU: Fallback mode

---

## 🔒 Security Features

- ✅ Password hashing (SHA-256)
- ✅ Session tokens (24-hour expiry)
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ File upload restrictions

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Module not found
```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Problem:** MongoDB connection timeout
- Check internet connection
- Verify MongoDB URI in `database.py`
- Whitelist IP in MongoDB Atlas

**Problem:** Model loading error
- Ensure `models/bestyolov.pt` exists
- Check PyTorch version compatibility
- Run `python verify_system.py`

### Frontend Issues

**Problem:** Cannot resolve '@/...'
```bash
cd frontend_next
rm -rf node_modules .next
npm install
```

**Problem:** API connection failed
- Verify backend is running on port 5000
- Check CORS settings
- Verify API_URL in `lib/api.ts`

**Problem:** Build errors
```bash
npm run build
# Check for TypeScript errors
```

### System Verification

Run the verification script:
```bash
cd backend
python verify_system.py
```

This checks:
1. MongoDB connection
2. Model loading
3. Dependencies
4. Directory structure
5. Admin user

---

## 📊 System Requirements

### Minimum Requirements
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 2 GB free space
- **Internet:** Required (MongoDB Atlas)

### Recommended Requirements
- **CPU:** 4+ cores
- **RAM:** 8 GB
- **GPU:** CUDA-compatible (optional, for faster inference)
- **Storage:** 5 GB free space

---

## 🚦 Development Workflow

### Backend Development
```bash
cd backend
.\venv\Scripts\Activate.ps1
python app.py
# Backend runs on http://localhost:5000
```

### Frontend Development
```bash
cd frontend_next
npm run dev
# Frontend runs on http://localhost:3000
# Hot reload enabled
```

### Testing
```bash
# Verify system
cd backend
python verify_system.py

# Frontend build test
cd frontend_next
npm run build
```

---

## 📦 Deployment

### Backend Deployment

**Option 1: Gunicorn (Linux/Mac)**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Option 2: Waitress (Windows)**
```bash
pip install waitress
waitress-serve --port=5000 app:app
```

### Frontend Deployment

```bash
cd frontend_next
npm run build
npm start
# Runs on http://localhost:3000
```

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

---

## 📝 License

This project is for educational and commercial use.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

For issues or questions:
1. Check this README
2. Run `python verify_system.py` for backend
3. Check browser console (F12) for frontend errors
4. Review MongoDB Atlas connection

---

## ✅ Quick Reference

| Component | Command | URL |
|-----------|---------|-----|
| Backend | `python app.py` | http://localhost:5000 |
| Frontend | `npm run dev` | http://localhost:3000 |
| Verify | `python verify_system.py` | - |
| MongoDB | cloud.mongodb.com | Atlas Dashboard |

**Default Admin:**
- Username: `admin`
- Password: `admin123`

---

Made with ❤️ using Flask, MongoDB Atlas, Next.js, and YOLOv8

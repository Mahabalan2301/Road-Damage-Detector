# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Your trained YOLO model (`best.pt`)

## 🚀 Windows Users

### 1. Add Your Model

Copy your trained YOLO model to:
```
backend/models/best.pt
```

### 2. Start Backend (First Time)

Double-click: `start_backend.bat`

This will:
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Start the server at http://localhost:5000

**Wait for**: `"✅ Loaded YOLO model"` message

### 3. Start Frontend

In a new window, double-click: `start_frontend.bat`

This will:
- ✅ Start local server at http://localhost:8000
- ✅ Open in your browser automatically

### 4. Use the System

1. **Upload** a road image (drag & drop or click)
2. **Click** "Analyze Image"
3. **View** detection results!

## 🐧 Linux/Mac Users

### 1. Add Your Model

```bash
cp /path/to/your/model.pt backend/models/best.pt
```

### 2. Make Scripts Executable

```bash
chmod +x start_backend.sh
chmod +x start_frontend.sh
```

### 3. Start Backend

```bash
./start_backend.sh
```

**Wait for**: `"✅ Loaded YOLO model"` message

### 4. Start Frontend (New Terminal)

```bash
./start_frontend.sh
```

### 5. Open Browser

Navigate to: http://localhost:8000

## 🎯 Testing

Try uploading an image of:
- Road with cracks
- Pothole
- Any pavement damage

Expected output:
- ✅ Bounding boxes around damage
- ✅ Classification labels
- ✅ Confidence scores

## ⚠️ Common Issues

### "YOLO model not found"
➡️ Ensure `backend/models/best.pt` exists

### "Port already in use"
➡️ Another process is using port 5000
- Kill the process or restart your computer

### "Server Offline" in frontend
➡️ Backend not running
- Start the backend first
- Wait for "✅ Loaded YOLO model" message

## 📝 Next Steps

- Read `README.md` for full documentation
- Check `SETUP.md` for detailed setup instructions
- Customize configuration in `backend/config.py`

## 🆘 Need Help?

1. Check error messages in the terminal
2. Read the troubleshooting section in `SETUP.md`
3. Ensure Python 3.8+ is installed: `python --version`

---

**Ready to detect road damage!** 🛣️✨


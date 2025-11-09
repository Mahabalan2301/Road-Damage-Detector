# 🚀 Setup Guide - Road Damage Detection System

Complete step-by-step guide to get your system up and running.

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 18+ (only for Next.js frontend)
- **RAM**: 8GB minimum, 16GB recommended
- **GPU**: NVIDIA GPU with CUDA support (optional, but recommended)

### Check Your System

```bash
# Check Python version
python --version

# Check Node.js version (if using Next.js)
node --version

# Check if CUDA is available (optional)
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

## Step 1: Clone or Download the Project

If you haven't already, download or clone this repository.

## Step 2: Backend Setup

### 2.1 Navigate to Backend

```bash
cd backend
```

### 2.2 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- Flask-CORS (enable cross-origin requests)
- Ultralytics (YOLOv8)
- PyTorch (deep learning)
- OpenCV (image processing)
- Pillow (image handling)
- NumPy (numerical operations)

**Note**: PyTorch installation may take several minutes depending on your internet connection.

### 2.4 Add Your Models

Place your trained models in the `backend/models/` directory:

```
backend/models/
├── best.pt              # Required: YOLO detection model
├── swin_model.pth       # Optional: Swin Transformer
└── tinyvit_model.pth    # Optional: TinyViT model
```

**Important**: At minimum, you need `best.pt` (your trained YOLO model).

### 2.5 Test Backend

Start the backend server:

```bash
python app.py
```

You should see:
```
🔧 Using device: cuda (or cpu)
✅ Loaded YOLO model from: ...
🚀 Starting Road Damage Detection API...
 * Running on http://0.0.0.0:5000
```

Test the API:

**In a new terminal:**
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "✅ Road Damage Detection API Running!",
  "version": "1.0.0",
  "models_loaded": {
    "yolo": true,
    ...
  }
}
```

If you see this, your backend is working! ✅

## Step 3: Frontend Setup

You have two options:

### Option A: Standalone Frontend (Recommended for Beginners)

#### 3.1 Navigate to Frontend

```bash
cd frontend_standalone
```

#### 3.2 Open in Browser

**Method 1: Direct Open**
- Simply double-click `index.html`

**Method 2: Local Server (Recommended)**

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

#### 3.3 Access the Application

Open your browser and navigate to:
- `http://localhost:8000` (if using a local server)
- Or the file location if opened directly

You should see a beautiful interface with:
- Upload area
- Server status indicator (should show "Online" in green)

### Option B: Next.js Component

#### 3.1 Setup Environment

Create `.env.local` in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 3.2 Install Dependencies

```bash
cd frontend
npm install
```

#### 3.3 Use the Component

Add to your page (e.g., `app/damage-detection/page.tsx`):

```tsx
import RoadDamageDetector from '@/components/road-damage-detector';

export default function DamageDetectionPage() {
  return (
    <div>
      <RoadDamageDetector />
    </div>
  );
}
```

#### 3.4 Run Next.js

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Step 4: Test the Complete System

### 4.1 Prepare Test Images

Get some test images of roads with damage (cracks, potholes, etc.).

### 4.2 Upload and Analyze

1. Click the upload area or drag an image
2. Click "Analyze Image"
3. Wait a few seconds for processing
4. View the results with bounding boxes and classifications

### 4.3 Expected Output

You should see:
- ✅ Annotated image with colored bounding boxes
- ✅ List of detected damages with confidence scores
- ✅ Legend showing damage types

## Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
# Ensure virtual environment is activated
# You should see (venv) in your prompt

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### Issue: "YOLO model not found"

**Solution:**
```bash
# Ensure your model file is in the correct location
ls backend/models/best.pt  # Linux/Mac
dir backend\models\best.pt  # Windows

# If file doesn't exist, copy your trained model to this location
```

#### Issue: "Address already in use"

**Solution:**
```bash
# Change port in backend/config.py
API_PORT = 5001  # or any other available port

# Or kill the process using port 5000

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

#### Issue: CUDA out of memory

**Solution:**
Edit `backend/app.py` to force CPU:
```python
device = torch.device("cpu")  # Change from "cuda"
```

### Frontend Issues

#### Issue: "Server Offline" status

**Solution:**
1. Ensure backend is running (`python app.py`)
2. Check API URL in frontend configuration
3. Verify no firewall blocking localhost:5000

#### Issue: CORS errors in browser console

**Solution:**
```bash
# Ensure flask-cors is installed
pip install flask-cors

# Verify CORS is enabled in backend/app.py
# Should see: CORS(app)
```

#### Issue: "Failed to load resource"

**Solution:**
- Check browser console for exact error
- Verify backend URL is correct
- Try accessing http://localhost:5000 directly in browser

### General Issues

#### Issue: Predictions are slow

**Solution:**
1. Use GPU if available
2. Reduce image size before upload
3. Use smaller YOLO model (e.g., yolov8n instead of yolov8x)

#### Issue: Low detection accuracy

**Solution:**
1. Adjust confidence threshold in `config.py`
2. Retrain models with more data
3. Try different lighting/angle for input images

## Next Steps

### Customize the System

1. **Change Detection Classes**: Edit `CLASS_NAMES` in `backend/config.py`
2. **Adjust Colors**: Modify `CLASS_COLORS` in `backend/config.py`
3. **UI Styling**: Edit `frontend_standalone/style.css`

### Deploy to Production

1. **Backend**: Use Gunicorn or uWSGI
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend**: Deploy to Vercel, Netlify, or any static host

3. **Models**: Consider using model quantization for faster inference

### Improve Performance

1. **Model Optimization**:
   - Use ONNX for faster inference
   - Quantize models (INT8)
   - Use TensorRT (NVIDIA GPUs)

2. **Caching**:
   - Cache model outputs for similar images
   - Use Redis for session management

3. **Batch Processing**:
   - Process multiple images at once
   - Implement queue system for high traffic

## Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md
2. Review error messages carefully
3. Search for similar issues online
4. Create an issue in the repository with:
   - Error message
   - Steps to reproduce
   - System information

---

Good luck with your road damage detection system! 🎉


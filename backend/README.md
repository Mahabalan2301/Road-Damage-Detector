# Road Damage Detection Backend

A Flask-based REST API for detecting and classifying road damage using YOLO and ensemble classification models.

## Features

- 🔍 **YOLO Detection**: Fast and accurate road damage detection
- 🧠 **Ensemble Classification**: Combines Swin Transformer and TinyViT for improved accuracy
- 🎨 **Visual Output**: Annotated images with bounding boxes and labels
- 🚀 **REST API**: Easy integration with frontend applications
- 🔧 **GPU Support**: Automatic GPU detection and usage

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add Your Models

Place your trained models in the `models/` directory:

```
backend/models/
├── best.pt              # YOLO detection model
├── swin_model.pth       # Swin Transformer (optional)
└── tinyvit_model.pth    # TinyViT model (optional)
```

**Note**: If you only have the YOLO model, the API will work with detection only.

### 4. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### `GET /`
Health check endpoint

**Response:**
```json
{
  "message": "✅ Road Damage Detection API Running!",
  "version": "1.0.0",
  "models_loaded": {
    "yolo": true,
    "swin": true,
    "tinyvit": true
  }
}
```

### `POST /predict`
Upload an image for damage detection

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` file

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "label": "pothole",
      "confidence": 0.95,
      "box": [100, 150, 300, 350]
    }
  ],
  "detection_count": 1,
  "annotated_image_url": "/outputs/pred_20250108_143022.jpg",
  "timestamp": "20250108_143022"
}
```

### `GET /outputs/<filename>`
Retrieve annotated output image

### `GET /models/info`
Get information about loaded models

**Response:**
```json
{
  "yolo": {
    "loaded": true,
    "path": "/path/to/best.pt"
  },
  "swin": {
    "loaded": true
  },
  "tinyvit": {
    "loaded": true
  },
  "classes": [
    "alligator crack",
    "longitudinal crack",
    "pothole",
    "transverse crack"
  ],
  "device": "cuda"
}
```

## Testing with cURL

```bash
# Health check
curl http://localhost:5000/

# Predict
curl -X POST -F "image=@path/to/image.jpg" http://localhost:5000/predict

# Model info
curl http://localhost:5000/models/info
```

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── models/            # Model weights directory
├── uploads/           # Temporary upload directory
└── outputs/           # Annotated output images
```

## Damage Classes

The system detects and classifies four types of road damage:

1. **Alligator Crack** (Red) - Interconnected cracks forming a pattern
2. **Longitudinal Crack** (Green) - Cracks parallel to road direction
3. **Pothole** (Blue) - Depression in the road surface
4. **Transverse Crack** (Yellow) - Cracks perpendicular to road direction

## GPU Support

The application automatically detects and uses GPU if available:
- CUDA-enabled GPU will be used if available
- Falls back to CPU if GPU is not available

## Troubleshooting

### Models not loading
- Ensure model files are in the `models/` directory
- Check file names match the configuration
- Verify model file permissions

### Port already in use
Change the port in `config.py` or run with a different port:
```bash
python app.py --port 5001
```

### Out of memory errors
- Reduce batch size
- Use CPU instead of GPU
- Resize input images before processing

## License

MIT License


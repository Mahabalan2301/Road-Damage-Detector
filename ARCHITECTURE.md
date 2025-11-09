# 🏗️ System Architecture

## Overview

The Road Damage Detection System is a full-stack application that combines deep learning models with a modern web interface.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  HTML/CSS/JS (Standalone) or React (Next.js)          │ │
│  │  - Image upload UI                                     │ │
│  │  - Results visualization                               │ │
│  │  - Download functionality                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST API
                          │ (POST /predict)
┌─────────────────────────▼───────────────────────────────────┐
│                      Flask Backend                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   API Layer                            │ │
│  │  - /predict (image upload & processing)                │ │
│  │  - /outputs/<filename> (serve results)                 │ │
│  │  - /health (status check)                              │ │
│  └────────────────────────┬───────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼───────────────────────────────┐ │
│  │              Processing Pipeline                       │ │
│  │  1. Receive image                                      │ │
│  │  2. YOLO detection                                     │ │
│  │  3. Crop detected regions                              │ │
│  │  4. Ensemble classification                            │ │
│  │  5. Annotate image                                     │ │
│  │  6. Return results                                     │ │
│  └────────────────────────┬───────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼───────────────────────────────┐ │
│  │                 Model Layer                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │  YOLOv8      │  │  Swin        │  │  TinyViT    │ │ │
│  │  │  Detection   │  │  Classifier  │  │  Classifier │ │ │
│  │  │  (Required)  │  │  (Optional)  │  │  (Optional) │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  GPU/CPU     │
                  │  (PyTorch)   │
                  └──────────────┘
```

## Component Details

### Frontend (Client-Side)

**Technologies:**
- HTML5, CSS3, JavaScript (Standalone)
- React, TypeScript, Next.js (Component version)
- Tailwind CSS (for Next.js component)

**Responsibilities:**
- User interface for image upload
- Display detection results
- Download annotated images
- Server status monitoring

**Communication:**
- REST API calls to Flask backend
- Multipart form data for image upload
- JSON responses for results

### Backend (Server-Side)

**Technologies:**
- Python 3.8+
- Flask (web framework)
- Flask-CORS (cross-origin support)

**Responsibilities:**
- API endpoint management
- Request validation
- File handling (upload/output)
- Model orchestration
- Response formatting

**API Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed status |
| `/predict` | POST | Image analysis |
| `/outputs/<file>` | GET | Serve results |
| `/models/info` | GET | Model information |

### ML Pipeline

**1. Detection Stage (YOLO)**
```python
Input: Road image (RGB)
↓
YOLOv8 Model
↓
Output: Bounding boxes [x1, y1, x2, y2]
```

**2. Classification Stage (Ensemble)**
```python
Input: Cropped regions from YOLO
↓
Swin Transformer → Probabilities
TinyViT → Probabilities
↓
Average probabilities
↓
Output: Class label + confidence
```

**3. Annotation Stage**
```python
Input: Original image + Predictions
↓
Draw bounding boxes (color-coded)
Add labels with confidence scores
↓
Output: Annotated image
```

## Data Flow

### Image Upload Flow

```
1. User selects image
   ↓
2. Frontend validates (type, size)
   ↓
3. POST to /predict endpoint
   ↓
4. Backend saves to uploads/
   ↓
5. Run detection & classification
   ↓
6. Save annotated image to outputs/
   ↓
7. Return JSON response
   ↓
8. Frontend displays results
```

### Response Structure

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

## Model Architecture

### YOLO Detection Model

```
Input Image (640×640)
    ↓
┌───────────────────┐
│   Backbone        │  Feature extraction
│   (CSPDarknet)    │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   Neck (PAFPN)    │  Feature fusion
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   Head            │  Detection head
└─────────┬─────────┘
          ↓
Bounding Boxes + Confidence
```

### Ensemble Classification

```
Cropped Region (224×224)
    ↓
┌──────────────────────┐
│  Swin Transformer    │
│  - Patch embedding   │
│  - Window attention  │
│  - MLP layers        │
└──────────┬───────────┘
           ↓
    Probabilities (4 classes)
           ↓
    ┌──────┴──────┐
    │   Average   │
    │   Ensemble  │
    └──────┬──────┘
           ↑
    Probabilities (4 classes)
           ↑
┌──────────┴───────────┐
│  TinyViT             │
│  - Efficient ViT     │
│  - Lightweight       │
│  - Fast inference    │
└──────────────────────┘
```

## Damage Classes

| Class ID | Name | Color | Detection Approach |
|----------|------|-------|-------------------|
| 0 | Alligator Crack | Red | Pattern-based, interconnected |
| 1 | Longitudinal Crack | Green | Linear, parallel to road |
| 2 | Pothole | Blue | Circular/irregular depression |
| 3 | Transverse Crack | Yellow | Linear, perpendicular to road |

## Storage Structure

```
roadDamageDetector/
├── backend/
│   ├── models/           # Model weights
│   │   ├── best.pt       # 100-500 MB
│   │   ├── swin_model.pth
│   │   └── tinyvit_model.pth
│   ├── uploads/          # Temporary storage
│   │   └── upload_*.jpg  # Deleted periodically
│   └── outputs/          # Results
│       └── pred_*.jpg    # Kept for download
```

## Performance Considerations

### Inference Speed

| Component | Time (GPU) | Time (CPU) |
|-----------|-----------|-----------|
| YOLO Detection | ~50ms | ~200ms |
| Per-crop Classification | ~10ms | ~50ms |
| Image Annotation | ~20ms | ~20ms |
| **Total (1 detection)** | **~80ms** | **~270ms** |

### Memory Usage

- Model loading: ~2-3 GB GPU memory
- Per-image processing: ~500 MB
- Recommended: 8GB RAM, 4GB GPU

### Optimization Strategies

1. **Model Quantization**: INT8 → 2-4x faster
2. **ONNX Export**: Platform-independent, faster
3. **TensorRT**: NVIDIA GPU optimization
4. **Batch Processing**: Multiple images at once
5. **Result Caching**: Store recent predictions

## Security Considerations

### Current Implementation

- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ CORS enabled (development)
- ✅ Temporary file cleanup

### Production Recommendations

- 🔐 Add authentication (JWT)
- 🔐 Rate limiting (prevent abuse)
- 🔐 Input sanitization
- 🔐 HTTPS only
- 🔐 Secure file storage
- 🔐 API key management

## Scalability

### Horizontal Scaling

```
Load Balancer
    ↓
├── Flask Instance 1 ─┐
├── Flask Instance 2 ─┼→ Shared Model Storage
├── Flask Instance 3 ─┤
└── Flask Instance N ─┘
```

### Vertical Scaling

- Multiple GPU support
- Increase worker processes
- Optimize batch size

## Deployment Options

### Development
- Flask built-in server
- Local file storage

### Production
1. **Simple**: Docker + Gunicorn
2. **Scalable**: Kubernetes + GPU nodes
3. **Serverless**: AWS Lambda (with container)
4. **Cloud**: GCP AI Platform, AWS SageMaker

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML/CSS/JS or React | User interface |
| API | Flask + Flask-CORS | REST endpoints |
| ML Framework | PyTorch | Deep learning |
| Detection | YOLOv8 (Ultralytics) | Object detection |
| Classification | Swin + TinyViT | Damage classification |
| Image Processing | OpenCV + Pillow | Image manipulation |
| Server | Gunicorn (prod) | WSGI server |

---

**Built for:** Road maintenance departments, research, automated inspection systems


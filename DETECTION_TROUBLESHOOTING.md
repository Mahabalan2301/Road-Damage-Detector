# 🔧 Detection Troubleshooting Guide

## Problem: Damage Not Being Detected Properly

### ✅ What I've Added to Help

1. **🐛 Debug Logging**: Backend now prints detailed detection info
2. **🎚️ Confidence Slider**: Frontend has adjustable sensitivity (0.05-0.50)
3. **📊 Visual Feedback**: Shows boxes AND masks for better visibility
4. **🔍 Lowered Default Threshold**: Changed from 0.25 to 0.15 for better detection

### 🔍 Step-by-Step Debugging

#### Step 1: Check Backend Logs

When you upload an image, look for this in the terminal:

```
🔍 Running inference with confidence: 0.15
📊 Detection Results:
   - Boxes detected: X
   - Masks detected: X
   - Classes: [0, 0, 1]
   - Confidences: [0.85, 0.72, 0.45]
```

**What to look for:**
- ✅ **Boxes & Masks detected**: Numbers should match if model works correctly
- ⚠️ **0 detections**: Try lowering confidence threshold
- ⚠️ **Boxes but no masks**: Model might not be trained for segmentation

#### Step 2: Adjust Confidence Threshold

**In the Frontend:**
1. Upload an image
2. Use the slider: **Detection Sensitivity**
3. Try different values:
   - **0.05-0.10**: Very sensitive (may have false positives)
   - **0.15-0.25**: Balanced (recommended)
   - **0.30-0.50**: Strict (only confident detections)

**In the Backend** (if you want to change default):
Edit `backend/app.py` line 47:
```python
CONF_THRESHOLD = 0.10  # Lower = more detections
```

#### Step 3: Check Your Model

**Verify model type:**
```python
# Look for this in backend logs
Model task: segment  # Should say "segment", not "detect"
```

If it says `detect` instead of `segment`, your model is a **detection** model, not a **segmentation** model.

**Solution:** Train a YOLOv8 **segmentation** model:
```python
from ultralytics import YOLO

# Use segmentation model (note the -seg suffix)
model = YOLO('yolov8n-seg.pt')  # NOT yolov8n.pt

# Train on segmentation dataset
model.train(data='your_data.yaml', epochs=150)
```

### 📋 Common Issues & Solutions

#### Issue 1: No Detections at All

**Symptoms:**
- Backend shows: `Boxes detected: 0`
- No annotations on image

**Possible Causes & Solutions:**

1. **Confidence too high**
   ```
   ✅ Solution: Lower to 0.05-0.10 using slider
   ```

2. **Wrong image type**
   ```
   ✅ Solution: Model trained on potholes won't detect cracks
   Check what your model was trained on
   ```

3. **Image quality issues**
   ```
   ✅ Solution: 
   - Use higher resolution images
   - Ensure good lighting
   - Avoid blurry images
   ```

4. **Model not properly trained**
   ```
   ✅ Solution: Check training metrics
   - Was validation mAP > 0.5?
   - Did training converge?
   ```

#### Issue 2: Boxes Detected but No Masks

**Symptoms:**
- Backend shows: `Boxes detected: 5, Masks detected: 0`

**Cause:** You're using a **detection** model, not a **segmentation** model

**Solution:**
```bash
# You need a segmentation model file
# Detection model: yolov8n.pt → Boxes only
# Segmentation model: yolov8n-seg.pt → Boxes + Masks

# Retrain with segmentation:
model = YOLO('yolov8n-seg.pt')  # Note the -seg
model.train(data='data.yaml', epochs=150)
```

#### Issue 3: False Detections

**Symptoms:**
- Detecting things that aren't damage
- Random areas highlighted

**Solutions:**

1. **Increase confidence threshold**
   ```
   Move slider to 0.30-0.40
   ```

2. **Retrain with better data**
   ```
   - Add more varied examples
   - Include hard negatives
   - Balance your classes
   ```

#### Issue 4: Misses Small Damage

**Symptoms:**
- Large potholes detected
- Small cracks missed

**Solutions:**

1. **Lower confidence**
   ```
   Try 0.05-0.10
   ```

2. **Use higher resolution**
   ```python
   # In backend/app.py, change:
   results = yolo_model.predict(str(img_path), conf=conf, imgsz=1280)
   # Changed from imgsz=640 to imgsz=1280
   ```

3. **Retrain with more small examples**

### 🧪 Testing Your Model

#### Quick Test

1. **Find a training image** that worked well during training
2. **Upload it** to the system
3. **Set confidence to 0.10**
4. **Check results**

If this works but real images don't:
- Your model might be overfitting
- Need more diverse training data

#### Manual Test (Python)

```python
from ultralytics import YOLO
import cv2

# Load your model
model = YOLO('backend/models/bestyolov.pt')

# Test on an image
results = model.predict('test_image.jpg', conf=0.10)

# Check results
print(f"Boxes: {len(results[0].boxes)}")
print(f"Masks: {len(results[0].masks) if results[0].masks else 0}")

# Visualize
annotated = results[0].plot()
cv2.imwrite('test_result.jpg', annotated)
```

### 📊 Understanding Detection Output

#### Good Detection:
```
🔍 Running inference with confidence: 0.15
📊 Detection Results:
   - Boxes detected: 3
   - Masks detected: 3  ✅ Same as boxes
   - Classes: [0, 0, 1]
   - Confidences: [0.89, 0.76, 0.45]
✅ Processing 3 masks...
   - Total area: 125840 pixels
   - Damage: 12.45%
💾 Saved result to: ...
```

#### Problem Detection:
```
🔍 Running inference with confidence: 0.15
📊 Detection Results:
   - Boxes detected: 0  ⚠️ No detections
   - Masks detected: 0
⚠️ No masks detected in image
```

### 🎯 Optimization Tips

#### For Better Accuracy:

1. **Data Quality**
   - High-resolution images (1280×720+)
   - Good lighting conditions
   - Clear, unobstructed views
   - Diverse angles and conditions

2. **Training Improvements**
   ```python
   # Better training parameters
   model.train(
       data='data.yaml',
       epochs=200,           # More epochs
       imgsz=640,
       patience=30,          # More patience
       batch=16,
       lr0=0.001,           # Adjust learning rate
       augment=True,        # Use augmentation
       mosaic=1.0,          # Mosaic augmentation
   )
   ```

3. **Model Size**
   ```
   - yolov8n-seg.pt: Fastest, least accurate
   - yolov8s-seg.pt: Balanced
   - yolov8m-seg.pt: Better accuracy
   - yolov8l-seg.pt: High accuracy
   - yolov8x-seg.pt: Best accuracy, slowest
   ```

### 🔧 Advanced Debugging

#### Enable Verbose Logging

Already enabled in the updated code! Check terminal for:
- Inference time
- Detection details
- Confidence scores
- Class IDs

#### Save Intermediate Results

Add to `segment_and_assess()`:
```python
# Save original image
cv2.imwrite('debug_original.jpg', img)

# Save masks separately
if results[0].masks:
    for i, mask in enumerate(results[0].masks.data.cpu().numpy()):
        mask_img = (mask * 255).astype(np.uint8)
        cv2.imwrite(f'debug_mask_{i}.jpg', mask_img)
```

#### Check Class Names

```python
# In backend console
print(yolo_model.names)  # Shows class names
# Should output: {0: 'pothole', 1: 'crack', ...}
```

### 📞 Still Having Issues?

1. **Share these details:**
   - Backend terminal output (the debug logs)
   - Model training metrics (mAP, loss curves)
   - Sample image that should work but doesn't
   - Confidence threshold you're using

2. **Check training results:**
   - Look at `runs/segment/train/results.png`
   - Check if validation metrics were good
   - Review confusion matrix

3. **Try with a pretrained model first:**
   ```python
   # Test with official pretrained model
   model = YOLO('yolov8n-seg.pt')
   model.predict('test.jpg', save=True)
   ```
   
   If this works but your model doesn't, it's a training issue.

### ✅ Checklist

Before asking for help, verify:

- [ ] Model file exists at `backend/models/bestyolov.pt`
- [ ] Backend logs show model loaded successfully
- [ ] Model task shows "segment" not "detect"
- [ ] Tried lowering confidence to 0.05-0.10
- [ ] Image is good quality and shows clear damage
- [ ] Model was trained on similar type of damage
- [ ] Training metrics showed good performance

---

**The system is now set up for easy debugging!** 🔧

Upload an image and watch the backend terminal for detailed information about what's being detected.


# 📖 Usage Guide - Road Damage Detection System

Complete guide to using the Road Damage Detection & Assessment System.

## 🎯 Overview

This system provides two modes for road damage detection:
1. **Image Upload Mode**: Analyze existing images
2. **Camera Capture Mode**: Real-time detection using your device camera

## 📤 Image Upload Mode

### Step 1: Select Mode
- Click the **"📤 Upload Image"** button at the top

### Step 2: Upload Image
You have three options:
- **Click** the upload area
- Click **"Select Image"** button
- **Drag & drop** an image into the upload area

**Supported formats**: JPG, JPEG, PNG
**Maximum size**: 10MB

### Step 3: Analyze
- Preview appears after upload
- Click **"🔍 Analyze Image"** button
- Wait for processing (usually 1-3 seconds)

### Step 4: View Results
The system displays:

#### Damage Statistics
- **Damage Percentage**: % of road surface damaged
- **Total Damaged Area**: Total pixels affected
- **Image Size**: Original image dimensions

#### Visual Results
- **Segmented Image**: Color-coded damage masks
- **Individual Areas**: List of each damaged area with size

#### Actions
- **⬇️ Download Result**: Save annotated image
- **🗑️ Clear**: Start over with new image

## 📷 Camera Capture Mode

### Step 1: Switch to Camera Mode
- Click the **"📷 Camera Capture"** button at the top

### Step 2: Start Camera
- Click **"📷 Start Camera"** button
- **Allow camera access** when prompted by browser
- Camera feed appears in the center

### Step 3: Real-time Detection
Once camera is active:
- System processes frames automatically every 2 seconds
- **Live statistics** shown in overlay:
  - Number of detections
  - Current damage percentage

### Step 4: Position Camera
- Point camera at road surface
- Keep distance ~1-2 meters for best results
- Ensure good lighting
- Hold steady for accurate detection

### Step 5: Capture for Detailed Analysis
When ready for full assessment:
1. Position camera on damaged area
2. Click **"📸 Capture & Analyze"** button
3. System captures frame and performs full analysis
4. Switches to results view automatically

### Step 6: View Detailed Results
Same detailed statistics as Image Upload Mode

## 🎓 Tips for Best Results

### Image Upload
✅ **Good Practices:**
- Use high-resolution images (1280×720 or higher)
- Ensure good lighting
- Capture from overhead angle
- Include clear view of damage
- Avoid motion blur

❌ **Avoid:**
- Low-quality images
- Dark or backlit photos
- Extreme angles
- Blurry images

### Camera Capture
✅ **Good Practices:**
- Use rear camera if available
- Maintain 1-2 meter distance
- Good natural or artificial lighting
- Hold device steady
- Perpendicular angle to road

❌ **Avoid:**
- Moving while capturing
- Too close or too far
- Low light conditions
- Reflections or glare
- Shaky camera

## 📊 Understanding Results

### Damage Percentage
- **0-5%**: Minimal damage, routine maintenance
- **5-15%**: Moderate damage, repair recommended
- **15-30%**: Significant damage, urgent repair needed
- **30%+**: Severe damage, immediate action required

### Individual Areas
- Each detected damage area listed separately
- Measured in pixels
- Use to prioritize repairs
- Track multiple damages in single image

### Segmentation Masks
- Color overlay shows exact damage location
- Useful for:
  - Repair planning
  - Cost estimation
  - Progress tracking
  - Documentation

## 🔧 Adjusting Settings

### Confidence Threshold
The system uses 25% confidence threshold by default.

To adjust (backend):
Edit `backend/app.py`:
```python
CONF_THRESHOLD = 0.25  # Change this value (0.0 to 1.0)
```

**Lower threshold** (0.1-0.2): More detections, may include false positives
**Higher threshold** (0.3-0.5): Fewer detections, only confident predictions

## 📱 Mobile Usage

### On Mobile Devices
- Full touch support
- Camera access on smartphones
- Responsive layout
- Optimized for mobile browsers

### Tips for Mobile
1. Use landscape orientation for better view
2. Tap screen to focus before capture
3. Use volume button for stability
4. Enable HDR for better image quality

## 💡 Common Use Cases

### 1. Road Inspection
- Drive/walk along road
- Capture images periodically
- Generate damage reports
- Track over time

### 2. Maintenance Planning
- Upload existing survey images
- Prioritize by damage percentage
- Estimate repair materials
- Plan work schedules

### 3. Documentation
- Before/after comparisons
- Progress tracking
- Insurance claims
- Quality assurance

### 4. Research
- Collect damage data
- Analyze patterns
- Train improved models
- Comparative studies

## 🚗 Field Usage Workflow

### Vehicle-mounted Camera
1. Mount smartphone on dashboard
2. Start Camera Mode
3. Drive at slow speed (5-10 mph)
4. System provides live detection
5. Capture detailed frames when needed

### Walking Survey
1. Use tablet or smartphone
2. Capture images every 10-20 meters
3. Include reference markers
4. Note GPS coordinates if possible

### Drone Survey
1. Capture overhead images
2. Maintain consistent altitude
3. Ensure overlap between images
4. Upload for batch processing

## 📈 Batch Processing

For multiple images:

### Manual Method
1. Upload each image individually
2. Download results
3. Compile report

### API Method (for developers)
```python
import requests

files = ['image1.jpg', 'image2.jpg', 'image3.jpg']

for file in files:
    with open(file, 'rb') as f:
        response = requests.post(
            'http://localhost:5000/predict',
            files={'image': f}
        )
        result = response.json()
        print(f"{file}: {result['percentage_damage']}% damaged")
```

## 🔍 Interpreting Edge Cases

### No Detections
- **Possible reasons**:
  - No actual damage in image
  - Damage too small or unclear
  - Poor image quality
  - Wrong surface type

### Multiple Small Detections
- **Interpretation**:
  - Early-stage cracking
  - Surface deterioration
  - Monitor for expansion

### Large Continuous Area
- **Interpretation**:
  - Severe pothole
  - Major structural damage
  - Requires immediate repair

## 🆘 Troubleshooting

### Camera Not Working
1. Check browser permissions
2. Try different browser
3. Restart browser
4. Check camera hardware

### Slow Processing
1. Reduce image size
2. Check internet connection
3. Verify server is running
4. Check server logs

### Inaccurate Results
1. Improve image quality
2. Adjust camera angle
3. Ensure good lighting
4. Try multiple captures

### Browser Issues
1. Clear browser cache
2. Try incognito mode
3. Update browser
4. Disable extensions

## 📞 Getting Help

If you encounter issues:
1. Check this guide
2. Review SETUP.md
3. Check server console for errors
4. Create issue with details:
   - Browser/device info
   - Error messages
   - Steps to reproduce
   - Screenshot if possible

---

**Happy Road Surveying!** 🛣️✨


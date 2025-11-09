from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import os
from datetime import datetime
from pathlib import Path
import base64
import torch
import database

# Add Ultralytics classes to PyTorch safe globals (for PyTorch 2.6+)
try:
    from ultralytics.nn.tasks import SegmentationModel, DetectionModel
    torch.serialization.add_safe_globals([SegmentationModel, DetectionModel])
except Exception:
    pass  # Older PyTorch versions don't need this

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize database
database.init_db()

# --------------------------
# Configuration
# --------------------------
BASE_DIR = Path(__file__).parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
OUTPUT_FOLDER = BASE_DIR / "outputs"
MODELS_FOLDER = BASE_DIR / "models"

# Create directories if they don't exist
UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)
MODELS_FOLDER.mkdir(exist_ok=True)

# --------------------------
# 1️⃣ Load YOLO Segmentation Model
# --------------------------
# YOLO Model Path
YOLO_PATH = MODELS_FOLDER / "bestyolov.pt"

# Initialize model
yolo_model = None

# Confidence threshold - Lower value = more detections (can detect weaker signals)
# Try 0.1 for more sensitive detection, 0.5 for stricter detection
CONF_THRESHOLD = 0.15  # Lowered from 0.25 for better detection

def load_models():
    """Load YOLO segmentation model at startup"""
    global yolo_model
    
    try:
        # Load YOLO Segmentation Model
        if YOLO_PATH.exists():
            print(f"📦 Loading YOLO model from: {YOLO_PATH}")
            yolo_model = YOLO(str(YOLO_PATH))
            print(f"✅ Successfully loaded YOLO Segmentation model")
            print(f"   Model task: {yolo_model.task}")
            
            # Test inference to ensure model works
            print(f"   Testing model inference...")
            test_array = np.zeros((640, 640, 3), dtype=np.uint8)
            _ = yolo_model.predict(test_array, verbose=False)
            print(f"   ✅ Model is ready for inference!")
        else:
            print(f"⚠️ YOLO model not found at {YOLO_PATH}")
            print(f"   Please place your trained YOLO segmentation model at: {YOLO_PATH}")
            
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print(f"   Tip: Make sure you have the latest ultralytics package:")
        print(f"   pip install --upgrade ultralytics")

# --------------------------
# 2️⃣ Road Damage Assessment Logic
# --------------------------
def calculate_damage_area(masks, image_shape):
    """Calculate total damage area from segmentation masks"""
    if masks is None or len(masks) == 0:
        return 0, 0, []
    
    total_area = 0
    image_area = image_shape[0] * image_shape[1]
    mask_areas = []
    
    # Convert masks to numpy if needed
    masks_np = masks.data.cpu().numpy() if hasattr(masks, 'data') else masks
    
    for mask in masks_np:
        # Convert to binary mask
        binary_mask = (mask > 0).astype(np.uint8) * 255
        
        # Find contours
        contours, _ = cv2.findContours(binary_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Calculate area of the largest contour
            area = cv2.contourArea(contours[0])
            mask_areas.append(area)
            total_area += area
    
    percentage_damage = (total_area / image_area) * 100 if image_area > 0 else 0
    
    return total_area, percentage_damage, mask_areas

def segment_and_assess(img_path, conf=CONF_THRESHOLD):
    """Perform segmentation and damage assessment"""
    if yolo_model is None:
        return None, None, {}
    
    # Run YOLO segmentation with lower confidence and show boxes temporarily for debugging
    print(f"🔍 Running inference with confidence: {conf}")
    results = yolo_model.predict(str(img_path), conf=conf, imgsz=640, verbose=True)
    
    # Debug: Print detection info
    print(f"📊 Detection Results:")
    print(f"   - Boxes detected: {len(results[0].boxes) if results[0].boxes is not None else 0}")
    print(f"   - Masks detected: {len(results[0].masks) if results[0].masks is not None else 0}")
    
    if results[0].boxes is not None and len(results[0].boxes) > 0:
        print(f"   - Classes: {results[0].boxes.cls.tolist() if hasattr(results[0].boxes, 'cls') else 'N/A'}")
        print(f"   - Confidences: {results[0].boxes.conf.tolist() if hasattr(results[0].boxes, 'conf') else 'N/A'}")
    
    # Read original image
    img = cv2.imread(str(img_path))
    
    # Get annotated image - show boxes AND masks for better visibility
    annotated_img = results[0].plot(boxes=True, conf=True, labels=True)
    
    # Calculate damage statistics
    damage_stats = {
        "total_detections": 0,
        "total_damaged_area": 0,
        "percentage_damage": 0.0,
        "individual_areas": [],
        "image_dimensions": {
            "width": img.shape[1],
            "height": img.shape[0],
            "total_pixels": img.shape[0] * img.shape[1]
        }
    }
    
    if results[0].masks is not None:
        print(f"✅ Processing {len(results[0].masks)} masks...")
        total_area, percentage_damage, mask_areas = calculate_damage_area(
            results[0].masks, img.shape
        )
        
        damage_stats.update({
            "total_detections": len(results[0].masks),
            "total_damaged_area": int(total_area),
            "percentage_damage": round(percentage_damage, 2),
            "individual_areas": [int(area) for area in mask_areas]
        })
        print(f"   - Total area: {total_area} pixels")
        print(f"   - Damage: {percentage_damage:.2f}%")
    else:
        print(f"⚠️ No masks detected in image")
    
    # Save annotated output
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    out_filename = f"pred_{timestamp}.jpg"
    out_path = OUTPUT_FOLDER / out_filename
    cv2.imwrite(str(out_path), annotated_img)
    print(f"💾 Saved result to: {out_path}")
    
    return out_filename, damage_stats, results[0]

# --------------------------
# 3️⃣ Real-time Camera Processing
# --------------------------
def process_frame(frame):
    """Process a single frame from camera"""
    if yolo_model is None:
        return frame, {}
    
    # Run inference
    results = yolo_model.predict(frame, conf=CONF_THRESHOLD, imgsz=640, verbose=False)
    
    # Get annotated frame
    annotated_frame = results[0].plot(boxes=False)
    
    # Calculate damage
    damage_stats = {
        "total_detections": 0,
        "percentage_damage": 0.0
    }
    
    if results[0].masks is not None:
        _, percentage_damage, _ = calculate_damage_area(results[0].masks, frame.shape)
        damage_stats.update({
            "total_detections": len(results[0].masks),
            "percentage_damage": round(percentage_damage, 2)
        })
    
    # Add text overlay
    text = f"Road Damage: {damage_stats['percentage_damage']:.2f}%"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1
    thickness = 2
    text_position = (40, 80)
    
    # Draw background for text
    (text_width, text_height), _ = cv2.getTextSize(text, font, font_scale, thickness)
    cv2.rectangle(annotated_frame, 
                 (text_position[0] - 10, text_position[1] - text_height - 10),
                 (text_position[0] + text_width + 10, text_position[1] + 10),
                 (0, 0, 255), -1)
    
    # Draw text
    cv2.putText(annotated_frame, text, text_position, font, font_scale, 
                (255, 255, 255), thickness, cv2.LINE_AA)
    
    return annotated_frame, damage_stats

# --------------------------
# 4️⃣ Flask Routes
# --------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "✅ Road Damage Segmentation API Running!",
        "version": "2.0.0",
        "model_loaded": yolo_model is not None,
        "task": "segmentation",
        "features": ["image_upload", "camera_capture", "damage_assessment"]
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": yolo_model is not None,
        "model_task": yolo_model.task if yolo_model else None
    })

@app.route("/predict", methods=["POST"])
def predict():
    """Handle image upload and segmentation"""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    img_file = request.files["image"]
    
    if img_file.filename == "":
        return jsonify({"error": "No image selected"}), 400
    
    try:
        # Save uploaded file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"upload_{timestamp}_{img_file.filename}"
        temp_path = UPLOAD_FOLDER / filename
        img_file.save(str(temp_path))
        
        # Get confidence threshold from request (optional)
        conf = float(request.form.get('confidence', CONF_THRESHOLD))
        
        # Run segmentation and assessment
        out_filename, damage_stats, results = segment_and_assess(temp_path, conf)
        
        return jsonify({
            "success": True,
            "annotated_image_url": f"/outputs/{out_filename}",
            "timestamp": timestamp,
            **damage_stats
        })
    
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/predict_frame", methods=["POST"])
def predict_frame():
    """Handle single frame prediction from camera"""
    try:
        # Get image data from request
        if "image" in request.files:
            img_file = request.files["image"]
            # Read image
            file_bytes = np.frombuffer(img_file.read(), np.uint8)
            frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        elif "frame" in request.json:
            # Base64 encoded frame
            frame_data = request.json["frame"]
            # Decode base64
            img_data = base64.b64decode(frame_data.split(',')[1] if ',' in frame_data else frame_data)
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            return jsonify({"error": "No image data provided"}), 400
        
        # Process frame
        annotated_frame, damage_stats = process_frame(frame)
        
        # Encode result as base64
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            "success": True,
            "frame": f"data:image/jpeg;base64,{frame_base64}",
            **damage_stats
        })
    
    except Exception as e:
        print(f"Error processing frame: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/outputs/<filename>")
def get_output(filename):
    """Serve annotated output images"""
    path = OUTPUT_FOLDER / filename
    if not path.exists():
        return jsonify({"error": "File not found"}), 404
    return send_file(str(path), mimetype="image/jpeg")

@app.route("/models/info")
def models_info():
    """Get information about loaded model"""
    return jsonify({
        "yolo": {
            "loaded": yolo_model is not None,
            "path": str(YOLO_PATH) if YOLO_PATH.exists() else None,
            "task": yolo_model.task if yolo_model else None
        },
        "confidence_threshold": CONF_THRESHOLD
    })

# --------------------------
# 5️⃣ Authentication & User Management Routes
# --------------------------
@app.route("/api/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.json
    
    required_fields = ['username', 'email', 'password', 'full_name']
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "error": "Missing required fields"}), 400
    
    success, result = database.create_user(
        data['username'],
        data['email'],
        data['password'],
        data['full_name'],
        data.get('phone'),
        'user'  # Default role
    )
    
    if success:
        return jsonify({"success": True, "user_id": result})
    else:
        return jsonify({"success": False, "error": "Username or email already exists"}), 400

@app.route("/api/login", methods=["POST"])
def login():
    """Login user"""
    data = request.json
    
    if 'username' not in data or 'password' not in data:
        return jsonify({"success": False, "error": "Missing credentials"}), 400
    
    success, user = database.verify_user(data['username'], data['password'])
    
    if success:
        token = database.create_session(user['id'])
        return jsonify({
            "success": True,
            "token": token,
            "user": user
        })
    else:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route("/api/verify", methods=["POST"])
def verify():
    """Verify session token"""
    data = request.json
    
    if 'token' not in data:
        return jsonify({"success": False, "error": "No token provided"}), 400
    
    success, user = database.verify_session(data['token'])
    
    if success:
        return jsonify({"success": True, "user": user})
    else:
        return jsonify({"success": False, "error": "Invalid or expired token"}), 401

# --------------------------
# 6️⃣ Ticket Management Routes
# --------------------------
@app.route("/api/tickets/create", methods=["POST"])
def create_ticket():
    """Create a new damage ticket"""
    # Verify authentication
    token = request.form.get('token') or request.headers.get('Authorization')
    if not token:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    success, user = database.verify_session(token)
    if not success:
        return jsonify({"success": False, "error": "Invalid session"}), 401
    
    # Get ticket data
    title = request.form.get('title')
    description = request.form.get('description')
    location = request.form.get('location')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    
    if not all([title, description, location]):
        return jsonify({"success": False, "error": "Missing required fields"}), 400
    
    # Handle image upload and analysis
    image_path = None
    annotated_image_path = None
    damage_data = None
    
    if 'image' in request.files:
        img_file = request.files['image']
        
        if img_file.filename != '':
            try:
                # Save uploaded file
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"ticket_{user['user_id']}_{timestamp}_{img_file.filename}"
                temp_path = UPLOAD_FOLDER / filename
                img_file.save(str(temp_path))
                
                # Get confidence threshold
                conf = float(request.form.get('confidence', CONF_THRESHOLD))
                
                # Run analysis
                out_filename, damage_stats, results = segment_and_assess(temp_path, conf)
                
                image_path = str(temp_path)
                annotated_image_path = out_filename
                damage_data = damage_stats
                
            except Exception as e:
                print(f"Error analyzing image: {e}")
    
    # Create ticket
    try:
        ticket_id = database.create_ticket(
            user['user_id'],
            title,
            description,
            location,
            image_path,
            annotated_image_path,
            damage_data,
            float(latitude) if latitude else None,
            float(longitude) if longitude else None
        )
        
        return jsonify({
            "success": True,
            "ticket_id": ticket_id,
            "damage_data": damage_data
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/tickets/my", methods=["POST"])
def get_my_tickets():
    """Get user's tickets"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    success, user = database.verify_session(token)
    if not success:
        return jsonify({"success": False, "error": "Invalid session"}), 401
    
    tickets = database.get_user_tickets(user['user_id'])
    return jsonify({"success": True, "tickets": tickets})

@app.route("/api/tickets/all", methods=["POST"])
def get_all_tickets_admin():
    """Get all tickets (admin only)"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    success, user = database.verify_session(token)
    if not success or user['role'] != 'admin':
        return jsonify({"success": False, "error": "Admin access required"}), 403
    
    tickets = database.get_all_tickets()
    return jsonify({"success": True, "tickets": tickets})

@app.route("/api/tickets/<int:ticket_id>", methods=["GET"])
def get_ticket(ticket_id):
    """Get single ticket"""
    ticket = database.get_ticket_by_id(ticket_id)
    
    if ticket:
        return jsonify({"success": True, "ticket": ticket})
    else:
        return jsonify({"success": False, "error": "Ticket not found"}), 404

@app.route("/api/tickets/<int:ticket_id>/update", methods=["POST"])
def update_ticket(ticket_id):
    """Update ticket status (admin only)"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    success, user = database.verify_session(token)
    if not success or user['role'] != 'admin':
        return jsonify({"success": False, "error": "Admin access required"}), 403
    
    status = data.get('status')
    admin_notes = data.get('admin_notes')
    
    if not status:
        return jsonify({"success": False, "error": "Status required"}), 400
    
    database.update_ticket_status(ticket_id, status, admin_notes)
    return jsonify({"success": True})

@app.route("/api/dashboard/stats", methods=["POST"])
def get_stats():
    """Get dashboard statistics"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    success, user = database.verify_session(token)
    if not success:
        return jsonify({"success": False, "error": "Invalid session"}), 401
    
    if user['role'] == 'admin':
        stats = database.get_dashboard_stats()
    else:
        stats = database.get_dashboard_stats(user['user_id'])
    
    return jsonify({"success": True, "stats": stats})

# --------------------------
# 7️⃣ Run App
# --------------------------
if __name__ == "__main__":
    print("🚀 Starting Road Damage Management System API...")
    load_models()
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)


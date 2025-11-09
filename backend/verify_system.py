"""
System Verification Script
Tests database connection and model loading
"""

import sys
from pathlib import Path

print("=" * 60)
print("ROAD DAMAGE DETECTION SYSTEM - VERIFICATION")
print("=" * 60)
print()

# Test 1: MongoDB Connection
print("[1] Testing MongoDB Connection...")
try:
    from database import get_db, init_db
    
    db = get_db()
    # Test connection
    db.command('ping')
    print("   [SUCCESS] MongoDB connection successful!")
    
    # Check collections
    collections = db.list_collection_names()
    print(f"   [SUCCESS] Found collections: {', '.join(collections)}")
    
    # Count documents
    user_count = db.users.count_documents({})
    ticket_count = db.tickets.count_documents({})
    session_count = db.sessions.count_documents({})
    
    print(f"   [INFO] Users: {user_count}")
    print(f"   [INFO] Tickets: {ticket_count}")
    print(f"   [INFO] Sessions: {session_count}")
    
except Exception as e:
    print(f"   [ERROR] MongoDB connection failed: {e}")
    sys.exit(1)

print()

# Test 2: YOLOv8 Model Loading
print("[2] Testing YOLOv8 Model...")
try:
    from ultralytics import YOLO
    import torch
    from ultralytics.nn.tasks import SegmentationModel, DetectionModel
    
    # Add safe globals
    torch.serialization.add_safe_globals([SegmentationModel, DetectionModel])
    
    model_path = Path(__file__).parent / 'models' / 'bestyolov.pt'
    
    if not model_path.exists():
        print(f"   [ERROR] Model file not found: {model_path}")
        sys.exit(1)
    
    print(f"   [INFO] Loading model from: {model_path}")
    model = YOLO(str(model_path))
    
    print(f"   [SUCCESS] Model loaded successfully!")
    print(f"   [INFO] Model task: {model.task}")
    print(f"   [INFO] Model type: {type(model.model).__name__}")
    
    # Test inference
    import numpy as np
    from PIL import Image
    
    # Create dummy image
    dummy_image = Image.fromarray(np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8))
    
    print("   [INFO] Testing model inference...")
    results = model(dummy_image, conf=0.15, verbose=False)
    print("   [SUCCESS] Model inference successful!")
    
except Exception as e:
    print(f"   [ERROR] Model loading/inference failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()

# Test 3: Flask Dependencies
print("[3] Testing Flask Dependencies...")
try:
    import flask
    import flask_cors
    import cv2
    import numpy
    
    print(f"   [SUCCESS] Flask: {flask.__version__}")
    print(f"   [SUCCESS] OpenCV: {cv2.__version__}")
    print(f"   [SUCCESS] NumPy: {numpy.__version__}")
    
except Exception as e:
    print(f"   [ERROR] Dependency check failed: {e}")
    sys.exit(1)

print()

# Test 4: Directory Structure
print("[4] Checking Directory Structure...")
try:
    dirs = ['models', 'uploads', 'annotated']
    for dir_name in dirs:
        dir_path = Path(__file__).parent / dir_name
        if dir_path.exists():
            print(f"   [SUCCESS] {dir_name}/ exists")
        else:
            print(f"   [WARNING] {dir_name}/ not found, creating...")
            dir_path.mkdir(exist_ok=True)
            print(f"   [SUCCESS] Created {dir_name}/")
    
except Exception as e:
    print(f"   [ERROR] Directory check failed: {e}")
    sys.exit(1)

print()

# Test 5: Admin User
print("[5] Verifying Admin User...")
try:
    from database import verify_user
    
    success, user = verify_user('admin', 'admin123')
    
    if success and user:
        print(f"   [SUCCESS] Admin user verified!")
        print(f"   [INFO] Username: {user['username']}")
        print(f"   [INFO] Email: {user['email']}")
        print(f"   [INFO] Role: {user['role']}")
    else:
        print(f"   [WARNING] Admin user not found or invalid credentials")
        print(f"   [INFO] Initializing database...")
        init_db()
        print(f"   [SUCCESS] Database initialized with admin user")
    
except Exception as e:
    print(f"   [ERROR] Admin verification failed: {e}")
    sys.exit(1)

print()
print("=" * 60)
print("[SUCCESS] ALL TESTS PASSED!")
print("=" * 60)
print()
print("System is ready!")
print("   Backend: python app.py")
print("   Frontend: cd ../frontend_next && npm run dev")
print()


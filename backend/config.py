"""Configuration settings for the Road Damage Detection API"""
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).parent
MODELS_FOLDER = BASE_DIR / "models"
UPLOAD_FOLDER = BASE_DIR / "uploads"
OUTPUT_FOLDER = BASE_DIR / "outputs"

# Model paths
YOLO_MODEL_PATH = MODELS_FOLDER / "best.pt"
SWIN_MODEL_PATH = MODELS_FOLDER / "swin_model.pth"
TINYVIT_MODEL_PATH = MODELS_FOLDER / "tinyvit_model.pth"

# API settings
API_HOST = "0.0.0.0"
API_PORT = 5000
DEBUG = True

# Model settings
YOLO_CONFIDENCE_THRESHOLD = 0.1
IMAGE_SIZE = 224

# Class names
CLASS_NAMES = [
    "alligator crack",
    "longitudinal crack",
    "pothole",
    "transverse crack"
]

# Colors for visualization (BGR format for OpenCV)
CLASS_COLORS = {
    "alligator crack": (255, 0, 0),      # Red
    "longitudinal crack": (0, 255, 0),   # Green
    "pothole": (0, 0, 255),              # Blue
    "transverse crack": (255, 255, 0)    # Yellow
}


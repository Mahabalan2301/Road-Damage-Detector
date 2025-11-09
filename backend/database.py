"""MongoDB database for Road Damage Management System"""
from pymongo import MongoClient
from datetime import datetime
import hashlib
import secrets

# MongoDB Connection
MONGODB_URI = "mongodb+srv://eyeharshraj_db_user:Password@cluster0.n0q5gg2.mongodb.net/"
DATABASE_NAME = "road_damage_db"

# Initialize MongoDB client
client = None
db = None

def get_db():
    """Get database connection"""
    global client, db
    if client is None:
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
    return db

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    """Initialize database with collections and default admin"""
    try:
        db = get_db()
        
        # Create indexes
        db.users.create_index("username", unique=True)
        db.users.create_index("email", unique=True)
        db.sessions.create_index("token", unique=True)
        db.sessions.create_index("expires_at")
        
        # Create default admin if not exists
        admin = db.users.find_one({"username": "admin"})
        if not admin:
            admin_password = hash_password('admin123')
            db.users.insert_one({
                "username": "admin",
                "email": "admin@roaddamage.com",
                "password": admin_password,
                "full_name": "System Administrator",
                "phone": None,
                "role": "admin",
                "created_at": datetime.now()
            })
            print("[SUCCESS] Created default admin user (username: admin, password: admin123)")
        
        print("[SUCCESS] MongoDB database initialized successfully")
        return True
    except Exception as e:
        print(f"[ERROR] Database initialization failed: {e}")
        return False

def create_user(username, email, password, full_name, phone=None, role='user'):
    """Create a new user"""
    try:
        db = get_db()
        hashed_password = hash_password(password)
        
        result = db.users.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "full_name": full_name,
            "phone": phone,
            "role": role,
            "created_at": datetime.now()
        })
        
        return True, str(result.inserted_id)
    except Exception as e:
        return False, str(e)

def verify_user(username, password):
    """Verify user credentials"""
    try:
        db = get_db()
        hashed_password = hash_password(password)
        
        user = db.users.find_one({
            "username": username,
            "password": hashed_password
        })
        
        if user:
            return True, {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"]
            }
        return False, None
    except Exception as e:
        print(f"[ERROR] User verification failed: {e}")
        return False, None

def create_session(user_id):
    """Create authentication session"""
    try:
        db = get_db()
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now().timestamp() + (24 * 60 * 60)  # 24 hours
        
        db.sessions.insert_one({
            "user_id": user_id,
            "token": token,
            "expires_at": expires_at,
            "created_at": datetime.now()
        })
        
        return token
    except Exception as e:
        print(f"[ERROR] Session creation failed: {e}")
        return None

def verify_session(token):
    """Verify session token"""
    try:
        db = get_db()
        
        session = db.sessions.find_one({
            "token": token,
            "expires_at": {"$gt": datetime.now().timestamp()}
        })
        
        if not session:
            return False, None
        
        # Get user info
        from bson import ObjectId
        user = db.users.find_one({"_id": ObjectId(session["user_id"])})
        
        if user:
            return True, {
                "user_id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"]
            }
        return False, None
    except Exception as e:
        print(f"[ERROR] Session verification failed: {e}")
        return False, None

def create_ticket(user_id, title, description, location, image_path=None, 
                 annotated_image_path=None, damage_data=None, latitude=None, longitude=None):
    """Create a new ticket"""
    try:
        db = get_db()
        
        damage_percentage = damage_data.get('percentage_damage', 0) if damage_data else 0
        total_damaged_area = damage_data.get('total_damaged_area', 0) if damage_data else 0
        total_detections = damage_data.get('total_detections', 0) if damage_data else 0
        
        # Set priority based on damage percentage
        if damage_percentage > 30:
            priority = 'high'
        elif damage_percentage > 15:
            priority = 'medium'
        else:
            priority = 'low'
        
        result = db.tickets.insert_one({
            "user_id": user_id,
            "title": title,
            "description": description,
            "location": location,
            "latitude": latitude,
            "longitude": longitude,
            "image_path": image_path,
            "annotated_image_path": annotated_image_path,
            "status": "pending",
            "priority": priority,
            "damage_percentage": damage_percentage,
            "total_damaged_area": total_damaged_area,
            "total_detections": total_detections,
            "admin_notes": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })
        
        return str(result.inserted_id)
    except Exception as e:
        print(f"[ERROR] Ticket creation failed: {e}")
        return None

def get_user_tickets(user_id):
    """Get all tickets for a user"""
    try:
        db = get_db()
        tickets = list(db.tickets.find({"user_id": user_id}).sort("created_at", -1))
        
        # Convert ObjectId to string and format dates
        for ticket in tickets:
            ticket["id"] = str(ticket["_id"])
            ticket["_id"] = str(ticket["_id"])
            ticket["created_at"] = ticket["created_at"].isoformat() if isinstance(ticket["created_at"], datetime) else str(ticket["created_at"])
            ticket["updated_at"] = ticket["updated_at"].isoformat() if isinstance(ticket["updated_at"], datetime) else str(ticket["updated_at"])
        
        return tickets
    except Exception as e:
        print(f"[ERROR] Failed to get user tickets: {e}")
        return []

def get_all_tickets():
    """Get all tickets (admin view)"""
    try:
        db = get_db()
        from bson import ObjectId
        
        tickets = list(db.tickets.find().sort("created_at", -1))
        
        # Enrich with user information
        for ticket in tickets:
            user = db.users.find_one({"_id": ObjectId(ticket["user_id"])})
            if user:
                ticket["username"] = user["username"]
                ticket["email"] = user["email"]
                ticket["full_name"] = user["full_name"]
                ticket["phone"] = user.get("phone")
            
            ticket["id"] = str(ticket["_id"])
            ticket["_id"] = str(ticket["_id"])
            ticket["created_at"] = ticket["created_at"].isoformat() if isinstance(ticket["created_at"], datetime) else str(ticket["created_at"])
            ticket["updated_at"] = ticket["updated_at"].isoformat() if isinstance(ticket["updated_at"], datetime) else str(ticket["updated_at"])
        
        return tickets
    except Exception as e:
        print(f"[ERROR] Failed to get all tickets: {e}")
        return []

def update_ticket_status(ticket_id, status, admin_notes=None):
    """Update ticket status"""
    try:
        db = get_db()
        from bson import ObjectId
        
        update_data = {
            "status": status,
            "updated_at": datetime.now()
        }
        
        if admin_notes is not None:
            update_data["admin_notes"] = admin_notes
        
        db.tickets.update_one(
            {"_id": ObjectId(ticket_id)},
            {"$set": update_data}
        )
        
        return True
    except Exception as e:
        print(f"[ERROR] Failed to update ticket: {e}")
        return False

def get_ticket_by_id(ticket_id):
    """Get single ticket by ID"""
    try:
        db = get_db()
        from bson import ObjectId
        
        ticket = db.tickets.find_one({"_id": ObjectId(ticket_id)})
        
        if ticket:
            user = db.users.find_one({"_id": ObjectId(ticket["user_id"])})
            if user:
                ticket["username"] = user["username"]
                ticket["email"] = user["email"]
                ticket["full_name"] = user["full_name"]
                ticket["phone"] = user.get("phone")
            
            ticket["id"] = str(ticket["_id"])
            ticket["_id"] = str(ticket["_id"])
            ticket["created_at"] = ticket["created_at"].isoformat() if isinstance(ticket["created_at"], datetime) else str(ticket["created_at"])
            ticket["updated_at"] = ticket["updated_at"].isoformat() if isinstance(ticket["updated_at"], datetime) else str(ticket["updated_at"])
            
            return ticket
        return None
    except Exception as e:
        print(f"[ERROR] Failed to get ticket: {e}")
        return None

def get_dashboard_stats(user_id=None):
    """Get dashboard statistics"""
    try:
        db = get_db()
        
        if user_id:
            # User stats
            query = {"user_id": user_id}
            total = db.tickets.count_documents(query)
            pending = db.tickets.count_documents({**query, "status": "pending"})
            in_progress = db.tickets.count_documents({**query, "status": "in_progress"})
            resolved = db.tickets.count_documents({**query, "status": "resolved"})
            
            return {
                'total_tickets': total,
                'pending': pending,
                'in_progress': in_progress,
                'resolved': resolved
            }
        else:
            # Admin stats
            total = db.tickets.count_documents({})
            pending = db.tickets.count_documents({"status": "pending"})
            in_progress = db.tickets.count_documents({"status": "in_progress"})
            resolved = db.tickets.count_documents({"status": "resolved"})
            users = db.users.count_documents({"role": "user"})
            
            return {
                'total_tickets': total,
                'pending': pending,
                'in_progress': in_progress,
                'resolved': resolved,
                'total_users': users
            }
    except Exception as e:
        print(f"[ERROR] Failed to get stats: {e}")
        return {
            'total_tickets': 0,
            'pending': 0,
            'in_progress': 0,
            'resolved': 0,
            'total_users': 0 if not user_id else None
        }

# Initialize database on import
if __name__ == '__main__':
    init_db()

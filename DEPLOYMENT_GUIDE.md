# 🚀 Deployment Guide - Road Damage Detection System

## System Verification ✅

Run the verification script to ensure everything is working:

```bash
cd backend
python verify_system.py
```

**Expected Output:**
```
============================================================
ROAD DAMAGE DETECTION SYSTEM - VERIFICATION
============================================================

[1] Testing MongoDB Connection...
   [SUCCESS] MongoDB connection successful!
   [SUCCESS] Found collections: users, sessions, tickets
   [INFO] Users: X
   [INFO] Tickets: X
   [INFO] Sessions: X

[2] Testing YOLOv8 Model...
   [INFO] Loading model from: backend/models/bestyolov.pt
   [SUCCESS] Model loaded successfully!
   [INFO] Model task: segment
   [INFO] Model type: SegmentationModel
   [INFO] Testing model inference...
   [SUCCESS] Model inference successful!

[3] Testing Flask Dependencies...
   [SUCCESS] Flask: 3.0.0
   [SUCCESS] OpenCV: 4.12.0
   [SUCCESS] NumPy: 2.2.6

[4] Checking Directory Structure...
   [SUCCESS] models/ exists
   [SUCCESS] uploads/ exists
   [SUCCESS] annotated/ exists

[5] Verifying Admin User...
   [SUCCESS] Admin user verified!
   [INFO] Username: admin
   [INFO] Email: admin@roaddamage.com
   [INFO] Role: admin

============================================================
[SUCCESS] ALL TESTS PASSED!
============================================================

System is ready!
   Backend: python app.py
   Frontend: cd ../frontend_next && npm run dev
```

---

## Quick Start Commands

### Start Backend (Terminal 1)
```bash
cd D:\project\roadDamageDetector\backend
.\venv\Scripts\Activate.ps1
python app.py
```

### Start Frontend (Terminal 2)
```bash
cd D:\project\roadDamageDetector\frontend_next
npm run dev
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: username: `admin`, password: `admin123`

---

## System Configuration

### Backend (Flask)
- **Port**: 5000
- **Database**: MongoDB Atlas (Cloud)
- **Model**: YOLOv8 Segmentation
- **Confidence**: 15% threshold

### Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **State**: React Context API

---

## Production Deployment

### Backend Deployment

#### Option 1: Gunicorn (Linux/Mac)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 300 app:app
```

#### Option 2: Waitress (Windows)
```bash
pip install waitress
waitress-serve --port=5000 --threads=4 app:app
```

### Frontend Deployment

#### Build for Production
```bash
cd frontend_next
npm run build
npm start
```

#### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables

Create `.env.local` in `frontend_next/`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Update `backend/database.py` to use environment variables:
```python
import os
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://...')
```

---

## Security Checklist

- [ ] Change admin password
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Configure MongoDB IP whitelist
- [ ] Set up rate limiting
- [ ] Enable CORS for specific domains only
- [ ] Regular database backups
- [ ] Update dependencies regularly

---

## Monitoring & Logs

### Backend Logs
```bash
# View logs
tail -f backend.log

# Or use systemd
journalctl -u road-damage-backend -f
```

### Frontend Logs
```bash
# Build logs
npm run build

# Server logs
npm start
```

---

## Backup Strategy

### MongoDB Atlas
- Automatic daily backups enabled
- Point-in-time recovery available
- Export collections manually:
```bash
mongoexport --uri="mongodb+srv://..." --collection=users --out=users_backup.json
```

### File System
```bash
# Backup uploads and annotated folders
tar -czf backup_$(date +%Y%m%d).tar.gz uploads/ annotated/
```

---

## Performance Optimization

### Backend
- Use Gunicorn with multiple workers
- Enable GPU for YOLO inference
- Cache model in memory
- Compress API responses

### Frontend
- Enable Next.js optimization
- Compress images
- Use CDN for static assets
- Enable caching headers

---

## Troubleshooting Production

### High CPU Usage
- Check YOLO inference load
- Increase workers/threads
- Enable GPU acceleration

### Memory Issues
- Monitor with `htop` or Task Manager
- Increase server RAM
- Optimize image processing

### Database Connection Issues
- Check MongoDB Atlas status
- Verify IP whitelist
- Check connection pool settings

---

## System Requirements (Production)

### Minimum
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD
- **Bandwidth**: 100 Mbps

### Recommended
- **CPU**: 8+ cores
- **RAM**: 16 GB
- **GPU**: NVIDIA GPU with CUDA support
- **Storage**: 100 GB SSD
- **Bandwidth**: 1 Gbps

---

## Maintenance

### Daily
- Monitor system health
- Check logs for errors
- Review ticket volume

### Weekly
- Database cleanup (expired sessions)
- Update dependencies
- Review security alerts

### Monthly
- Full system backup
- Performance review
- User feedback analysis
- Update documentation

---

## Support & Debugging

### System Health Check
```bash
cd backend
python verify_system.py
```

### Check Backend Status
```bash
curl http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Check Frontend Build
```bash
cd frontend_next
npm run build
```

### Clear Cache
```bash
# Backend
rm -rf backend/__pycache__
rm -rf backend/venv

# Frontend
rm -rf frontend_next/.next
rm -rf frontend_next/node_modules
npm install
```

---

## Scaling Guidelines

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (Nginx/HAProxy)
- Separate AI inference service

### Vertical Scaling
- Increase server resources
- Add GPU for YOLO
- Upgrade MongoDB tier

### Database Scaling
- MongoDB Atlas auto-scaling
- Add read replicas
- Enable sharding for large datasets

---

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          ssh user@server 'cd /app && git pull && systemctl restart backend'
      - name: Deploy Frontend
        run: |
          cd frontend_next
          vercel --prod
```

---

## License & Credits

- **YOLOv8**: Ultralytics (AGPL-3.0)
- **Flask**: BSD License
- **Next.js**: MIT License
- **MongoDB**: Server Side Public License

---

**System is production-ready!** ✅

For questions or issues, run `python verify_system.py` and check the logs.


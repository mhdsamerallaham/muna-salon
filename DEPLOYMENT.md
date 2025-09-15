# 🚀 Deployment Guide - Muna Kuaför

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Frontend build optimized
- [x] Backend server configured
- [x] Email service setup (Hostingar SMTP)
- [x] Environment variables prepared
- [x] Git repository initialized
- [x] Production testing completed

### 🔧 Required Steps

## 1. GitHub Repository Setup

1. **Create Repository** on GitHub:
   - Repository name: `muna-salon`
   - Set as public or private
   - Don't initialize with README (we already have one)

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/mhdsamerallaham/muna-salon.git
   git branch -M main
   git push -u origin main
   ```

## 2. Hosting Setup

### Option A: Netlify (Recommended for Frontend)
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
3. Set environment variables in Netlify dashboard

### Option B: Vercel
1. Import GitHub repository to Vercel
2. Framework preset: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`

### Option C: Traditional VPS/Hosting
1. Upload files via FTP/Git
2. Install Node.js (v16+)
3. Run `npm run install-all`
4. Configure environment variables
5. Start services

## 3. Environment Variables Setup

### Backend (.env file):
```env
# Email Configuration - Update with real credentials
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
EMAIL_USER=info@muna-kuafor.com
EMAIL_PASS=YOUR_REAL_HOSTINGAR_PASSWORD

# Target email for notifications
NOTIFICATION_EMAIL=mounaalnabhanio@gmail.com

# Application Settings
NODE_ENV=production
PORT=5001

# Domain Settings (update after deployment)
FRONTEND_URL=https://muna-kuafor.com
BACKEND_URL=https://api.muna-kuafor.com
```

### Frontend Environment (if needed):
```env
VITE_API_URL=https://api.muna-kuafor.com
```

## 4. Domain Configuration

### Main Domain: muna-kuafor.com
- Point to frontend hosting (Netlify/Vercel)
- Configure SSL certificate (automatic with Netlify/Vercel)

### API Subdomain: api.muna-kuafor.com
- Point to backend server
- Configure SSL certificate
- Update CORS settings in backend

## 5. Email Service Activation

### Hostingar Email Setup:
1. **Access Hostingar Control Panel**
2. **Create Email Account**: info@muna-kuafor.com
3. **Get SMTP Credentials**:
   - Host: smtp.hostinger.com
   - Port: 465 (SSL)
   - Username: info@muna-kuafor.com
   - Password: [Get from Hostingar]
4. **Update .env file** with real credentials

### Test Email:
```bash
# After deployment, test with:
curl -X POST https://api.muna-kuafor.com/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"123","service":"haircut","date":"2025-09-20","time":"10:00","language":"ar"}'
```

## 6. Database Setup

### JSON Database (Current - Free!)
- Files automatically created in `backend/data/`
- No additional setup required
- 100% free hosting compatible

### Optional: MongoDB Atlas (Paid)
If you want to switch to MongoDB later:
1. Create MongoDB Atlas account
2. Update connection string in server.js
3. Uncomment MongoDB code sections

## 7. Performance Optimization

### Frontend:
- [x] Vite build optimization
- [x] Video lazy loading
- [x] CSS minification
- [x] Bundle size optimization

### Backend:
- [x] Express.js optimization
- [x] CORS configuration
- [x] Error handling
- [x] Email service failsafe

## 8. Security Configuration

### HTTPS:
- Automatic with Netlify/Vercel
- Required for production

### CORS:
```javascript
// Already configured in server.js
app.use(cors({
  origin: ['https://muna-kuafor.com', 'https://www.muna-kuafor.com'],
  credentials: true
}));
```

### Environment Security:
- Never commit .env files
- Use hosting platform environment variables
- Keep email credentials secure

## 9. Monitoring & Maintenance

### Email Notifications:
- Monitor inbox: mounaalnabhanio@gmail.com
- Check spam folder initially
- Verify SMTP connection

### Admin Panel:
- URL: https://muna-kuafor.com/admin
- Login: admin / muna2024
- Change password in production

### Database Backup:
- JSON files in `backend/data/`
- Regular backup recommended
- Consider Git-based backup

## 10. Post-Deployment Testing

### Frontend Tests:
1. **Homepage Loading**: Videos, animations, responsiveness
2. **Language Switch**: Arabic ↔ Turkish
3. **Appointment Booking**: Full workflow
4. **Admin Panel**: Login and functionality

### Backend Tests:
1. **API Endpoints**: All routes working
2. **Email Sending**: Notification delivery
3. **Time Blocking**: Appointment conflicts
4. **Data Persistence**: JSON file updates

### Email Tests:
1. **Website Bookings**: Auto-notification
2. **Admin Bookings**: WhatsApp appointments
3. **Arabic Templates**: Proper display
4. **Islamic Blessing**: Correct formatting

## 🎯 Production URLs

After deployment:
- **Website**: https://muna-kuafor.com
- **Admin Panel**: https://muna-kuafor.com/admin
- **API**: https://api.muna-kuafor.com

## 📞 Support Information

### Technical:
- React 18 + Vite frontend
- Node.js + Express backend
- JSON file database
- Hostingar email service

### Contact:
- **Admin Email**: info@muna-kuafor.com
- **Notifications**: mounaalnabhanio@gmail.com
- **GitHub**: https://github.com/mhdsamerallaham/muna-salon

---

## 🤲 بإذن الله

**اللهم بارك في هذا العمل وأتمه على خير**
*O Allah, bless this work and complete it with goodness*

**✨ Ready for professional deployment! ✨**
# Admin Panel

This is a **Node.js** based **Admin Panel** that includes features like notifications, and access control with LAN, OTP-based authentication, and VPN restrictions.

## 🚀 Features
- **Authentication & Security**
  - Admin login with token-based authentication.
  - LAN-restricted access with OTP & VPN validation for remote access.
  - Unauthorized access logging with alerts via email & SMS For super Admin.
- **Real-time Notifications**
  - For Super Admin if unauthorized access is attempted,
  - send an alert email/SMS to the super admin
    
## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT, OTP-based login
- **Notifications:** Nodemailer & twilio
- **Security:** VPN, OTP, Static IP & LAN-based access control

## 🔧 Setup Instructions .env file 

- PORT=5000
- MONGO_URI= 
- JWT_SECRET=
- EMAIL_USER=
- EMAIL_PASS=
- TWILIO_SID=
- TWILIO_AUTH_TOKEN=
- TWILIO_PHONE_NUMBER=
- SUPER_ADMIN_EMAIL=
- SUPER_ADMIN_PHONE=
- OTP_EXPIRATION_MINUTES=
- IPINFO_TOKEN= 'vpn service'

### 1️⃣ Clone the Repository
- git clone https://github.com/maheshgitte88/secure-admin-panel.git
- cd secure-admin-panel
- cd node server.js

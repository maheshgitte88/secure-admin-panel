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

### secure-admin-panel
- secure-admin-panel Multi-Layered Authentication for Remote Admins
Static IP , LAN Access , OTP & VPN

- Log all access attempts and store them in MongoDB.

- **Tech:** Node.js Express, mongodb
- **Used Services:** Twilio, nodemailer, ipinfo.io,

﻿

POST
### Register Admin (Initial Admin User)
- http://localhost:5000/api/auth/register
📌 Endpoint: POST /api/auth/register
🔹 Description: Creates a new admin user.
📩 Body (JSON):

✅ Expected Response (201 Created):

JSON
{
  "message": "Admin registered successfully"
}
﻿

- **Body**
raw (json)
json
{
  "email": "maheshgitte7788@gmail.com",
  "password": "Admin@123",
  "fullName": "Super Admin",
  "staticIP": "45.77.23.10",
  "isSuperAdmin": true
}



POST
### Login as Admin
- http://localhost:5000/api/auth/login
📌 Endpoint: POST /api/auth/login
🔹 Description: Logs in an admin and returns a JWT token.
📩 Body (JSON):

✅ Expected Response (200 OK):

JSON
{
  "token": "your_jwt_token_here"
}
﻿
- **Body**
raw (json)
json
{
  "email": "admin@example.com",
  "password": "Admin@123",
  "ip": "192.168.1.100"
}




POST
### Generate OTP for Remote Admin
- http://localhost:5000/api/auth/generate-otp
📌 Endpoint: POST /api/auth/generate-otp
🔹 Description: Sends OTP to admin’s email for remote login.
📩 Body (JSON):

✅ Expected Response (200 OK):

JSON
{
  "message": "OTP sent"
}
﻿

- **Body**
raw (json)
json
{
  "email": "admin@example.com"
}



POST
### Validate OTP for Remote Access
http://localhost:5000/api/auth/validate-otp
📌 Endpoint: POST /api/auth/validate-otp
🔹 Description: Validates OTP and grants access.
📩 Body (JSON):

- ✅ Expected Response (200 OK):

JSON
{
  "token": "your_jwt_token_here"
}
﻿

- **Body**
json
{
  "email": "admin@example.com",
  "otp": "123456"
}




GET
### Access Admin Panel (LAN, staticIP, OTP & VPI )
- http://localhost:5000/admin
📌 Endpoint: GET /admin
🔹 Description: Access the secure admin panel. send otp if reuired, all login fasle & true save into db
📩 Headers:
Authorization: Bearer your_jwt_token_here
otp: "xyz123"

- ✅ Expected Response (200 OK, LAN Only):EndFragment

JSON
{
  "message": "Welcome to the Secure Admin Panel",
  "admin": {
    "id": "64f8b8c14ef9e7b64f8b8c14",
    "email": "admin@example.com",
    "fullName": "Super Admin"
  }
}




### 📌 Test unauthorized access attempts by using an IP outside 192.168.x.x or 10.x.x.x
- ✅ Expected Log Entry in MongoDB (AccessLog Collection)

JSON
{
  "ip": "45.78.23.20",
  "success": false,
  "device": "Mozilla/5.0 (Windows NT 10.0)",
  "createdAt": "2025-03-23T10:10:00Z"
}

-🔔 Super Admin Email/SMS Alert TriggeredEndFragment




### 📌 Fail Login 5 Times
- Response after 5th failed attempt (403 Forbidden):

JSON
{
  "message": "Account locked"
}


✅ Admin Gets Email Alert:  

Subject: Account Locked
Your account has been locked due to too many failed login attempts.

### Note
- For Local Testing Need to un comment the code In **ipMiddleware.js**  

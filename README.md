
# Node.js Backend with MongoDB

This is a Node.js backend application with MongoDB, implementing user authentication, authorization, OTP verification, password reset, user management, and image upload functionality. It supports multiple user roles (admin, licensee, vendor, user) and includes features like user blocking, filtering, and profile image management.

---

## 📚 Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Adding New Features](#adding-new-features)
- [Contributing](#contributing)
- [Notes](#notes)

---

## 🚀 Features

### 🔐 Authentication
- JWT-based signin/signup with email and password

### 🛡️ Authorization
- Role-based access control (`admin`, `licensee`, `vendor`, `user`)

### 📩 OTP Verification
- Email-based OTP for account verification

### 🔑 Password Management
- Forgot password and reset password using OTP

### 👤 User Management
- Block/unblock users (admin only)
- Get current user, all users, or filter by role (admin only)
- Update or delete users (admin only)

### 🖼️ Image Upload
- Upload profile images (`JPEG`, `JPG`, `PNG`, max 5MB)
- Automatically deletes previous image on update
- Deletes image when user is deleted

### 🧱 Security
- Password hashing, input validation, and blocked user checks

---

## 🗂️ Folder Structure

See original message above.

---

## 🧰 Prerequisites

- Node.js (v14.x or higher)
- MongoDB (Local or Atlas)
- Gmail Account (for sending OTPs)
- Git
- NPM

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Uploads Folder
```bash
mkdir -p uploads/profile_images
chmod -R 755 uploads
```

---

## 🔧 Configuration

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

✅ Use an App Password from Gmail (with 2FA enabled) for `EMAIL_PASS`

---

## ▶️ Running the Application

Ensure MongoDB is running.

Start server:
```bash
npm start
```

For development with hot reload:
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/register` | Alias for signup |
| POST | `/auth/signin` | User login |
| POST | `/auth/login` | Alias for signin |
| POST | `/auth/verify-otp` | Verify account with OTP |
| POST | `/auth/forgot-password` | Request OTP for password reset |
| POST | `/auth/reset-password` | Reset password with OTP |

---

### 👤 User Routes (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/current` | Get current user profile |
| GET | `/user/all` | Get all users *(admin only)* |
| GET | `/user/filter?role=` | Filter users by role *(admin only)* |
| PUT | `/user/:id` | Update user *(admin only)* |
| DELETE | `/user/:id` | Delete user *(admin only)* |
| PUT | `/user/:id/block` | Block user *(admin only)* |
| PUT | `/user/:id/unblock` | Unblock user *(admin only)* |
| POST | `/user/profile/image` | Upload profile image |

> Access uploaded images at: `http://localhost:5000/uploads/profile_images/<filename>`

---

## 🧪 Testing

Use Postman or similar tool:

### Signup
```http
POST /api/auth/signup
Body: { "email": "test@example.com", "password": "password123", "role": "user" }
```

### Verify OTP
```http
POST /api/auth/verify-otp
Body: { "email": "test@example.com", "otp": "123456" }
```

### Signin
```http
POST /api/auth/signin
Body: { "email": "test@example.com", "password": "password123" }
```

### Upload Profile Image
```yaml
POST /api/user/profile/image
Headers: Authorization: Bearer <token>
Body: Form-data { profileImage: file }
```

---

## 🧩 Adding New Features

### Add a Route
```js
router.get('/new-endpoint', auth, (req, res) => {
  res.json({ message: 'New endpoint' });
});
```

### Add a Controller
```js
const newFunction = async (req, res) => {
  try {
    // logic here
    res.json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
```

### Add a Model
```js
const mongoose = require('mongoose');
const newSchema = new mongoose.Schema({
  field: { type: String, required: true }
});
module.exports = mongoose.model('NewModel', newSchema);
```

### Add Middleware
```js
const newMiddleware = (req, res, next) => {
  // validation logic
  next();
};
module.exports = newMiddleware;
```

### Image Resizing (optional)

Install `sharp`:
```bash
npm install sharp
```

Then modify `middleware/multer.js` to use `sharp` for resizing images.

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📝 Notes

- **Security**: Never expose `JWT_SECRET`. Use environment variables.
- **Production**: Use cloud storage like AWS S3 for images.
- **Environment**: Separate `.env` for dev and prod environments.
- **Error Handling**: Use consistent try/catch and validation.
- **MongoDB**: Use MongoDB Atlas for production.
- **Email**: Gmail App Passwords required for OTP emails.

For any issues or enhancements, please open an issue or contact the maintainer.

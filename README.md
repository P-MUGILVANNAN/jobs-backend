# Job Portal Backend API

This is the backend API for the **Job Portal Application** built using **Node.js, Express, MongoDB, and JWT Authentication**.  
It includes routes for **authentication, jobs, users, admin functionalities, and applications management**.  
Swagger API documentation is available for easy testing.

---

## 🚀 Tech Stack
- **Node.js** with **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Multer + Cloudinary** for file upload
- **Swagger UI** for API Documentation
- **Nodemailer** for email notifications

---

## 🔑 Authentication
Most routes are protected using JWT (`Authorization: Bearer <token>`).  
Admin-only routes require the logged-in user to have the role `admin`.

---

## 📌 API Routes

### 1️⃣ Auth Routes (`/api/auth`)
- **POST** `/register` → Register a new user  
- **POST** `/login` → Login user (returns token)  
- **POST** `/google` → Google authentication  

---

### 2️⃣ User Routes (`/api/user`)
- **PUT** `/update` → Update profile (profileImage, coverImage, resume upload)  
- **GET** `/profile` → Get logged-in user profile  

---

### 3️⃣ Job Routes (`/api/jobs`)
- **GET** `/` → Get all jobs (public)  
- **GET** `/:id` → Get a job by ID (public)  
- **POST** `/` → Create a job (admin only, with `companyImage` upload)  
- **PUT** `/:id` → Update a job (admin only, with `companyImage` upload)  
- **DELETE** `/:id` → Delete a job (admin only)  

---

### 4️⃣ Admin Routes (`/api/admin`)
- **GET** `/users` → Get all job seekers  
- **GET** `/users/:id` → Get single user details  
- **DELETE** `/users/:id` → Delete a suspicious/blocked user  
- **PATCH** `/users/:id/toggle-suspicious` → Flag/unflag a user as suspicious  

---

### 5️⃣ Admin Dashboard Routes (`/api/admin/dashboard`)
- **GET** `/stats` → Get dashboard statistics (jobs, users, applications)  

---

### 6️⃣ Admin Application Routes (`/api/admin/applications`)
- **POST** `/apply` → Admin applies on behalf of a user  
- **GET** `/jobs/:jobId/applications` → Get all applications for a job  
- **GET** `/applications` → Get all applications  
- **PATCH** `/applications/:appId` → Update application status (accept/reject/shortlist)  
- **POST** `/applications/:appId/notify` → Notify applicant via email/notification  

---

## ⚡ Setup & Installation

```bash
# Clone repo
git clone https://github.com/your-username/job-portal-backend.git
cd job-portal-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run Server
# Development
npm run dev

# Production
npm start

# API Documentation (Swagger)

# After running the server, visit:
👉 http://localhost:5000/api-docs

# Features

User authentication (local + Google OAuth)
Admin dashboard with stats
CRUD operations for jobs
Job applications with status updates
File uploads (profile, cover image, resume, company image)
Email notifications with Nodemailer
Swagger UI integrated
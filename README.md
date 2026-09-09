# Student Management System

A full-stack web application for managing student records, courses, and related academic information through a clean and responsive dashboard.

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected application routes
- Secure password hashing

### Student Management
- Add new students
- View student records
- Update student information
- Delete student records
- View detailed student information
- Search and filter student records
- Pagination for student listings
- Student status management

### Course Management
- Add courses
- View available courses
- Update course information
- Delete courses
- Manage course-related student information

### Dashboard
- Overview of student data
- Student statistics
- Active student count
- Course statistics
- Recent student information
- Student status breakdown

### UI & Experience
- Responsive design
- Mobile-friendly layout
- Reusable UI components
- Loading and error states
- Confirmation dialogs
- Form validation

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Zod Validation
- bcrypt

### Development Tools
- Git
- GitHub
- npm

## 📁 Project Structure

```text
student-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   ├── scripts/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md

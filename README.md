# Student Management System

A full-stack web application for managing student records and courses through a clean, responsive admin dashboard.

🔗 **Live Demo:** https://student-management-six-hazel.vercel.app

---

## Overview

Student Management System is a full-stack application designed to simplify student and course management through a centralized admin panel.

The application provides authentication, student CRUD operations, course management, and dashboard statistics. It uses a React frontend, Node.js/Express backend, and MongoDB database.

---

## Features

### Authentication
- Admin registration
- Admin login
- JWT-based authentication
- Protected application routes
- Logout functionality

### Student Management
- Add new students
- View student records
- Edit student information
- Delete students
- Track student status
- View student statistics

### Course Management
- Create courses
- View available courses
- Edit course information
- Delete courses

### Dashboard
- Total students
- Active students
- Graduated students
- Total courses
- Recent students
- Students grouped by status

### User Experience
- Responsive dashboard interface
- Clean navigation
- Form validation
- Loading and error states
- Client-side routing

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

### Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Mongoose

### Database

- MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## Architecture

```text
┌─────────────────────────────┐
│          Frontend           │
│      React + TypeScript     │
│          Vercel             │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           Backend           │
│    Node.js + Express.js     │
│          Render             │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          Database           │
│        MongoDB Atlas        │
└─────────────────────────────┘

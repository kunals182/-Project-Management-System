# TaskFlow — Mini Project Management System

A full-stack project management application built built with Node.js (Express) and React. This application allows users to create and manage projects, and uniquely track tasks with different statuses and priorities inside them.

## 🚀 Built With

- **Backend:** Node.js, Express, `sql.js` (WebAssembly SQLite for zero-config persistence)
- **Frontend:** React (Vite), React Router, Custom CSS (No heavy UI frameworks)
- **Database:** SQLite (file-based persistence, no external server required)

## 📦 Features

- **Project Management:** Create, list (with pagination), view, and delete projects.
- **Task Kanban:** Add, update, and delete tasks inside specific projects.
- **Advanced Controls:** Filter tasks by status (`todo`, `in-progress`, `done`) and sort by `due_date`, `priority`, or `created_at`.
- **Validation:** Server-side input validation and graceful error handling.
- **Responsive UI:** Modern, clean, handwritten dark-themed interface.

---

## 🛠️ Setup Instructions

This project is designed to run seamlessly on your local machine with minimal setup.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1️⃣ Automatic Startup (Windows only)
If you are on a Windows machine, simply double-click the `start.bat` file in the root directory. This script will automatically boot up both the backend and frontend servers and keep them running.

### 2️⃣ Manual Startup (All platforms)

**Start the Backend:**
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The backend will run on http://localhost:5000*

**Start the Frontend:**
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

Open your browser and navigate to `http://localhost:5173` to view the application!

---

## 🗄️ Database Info
The application uses `sql.js` which writes a physical SQLite database file to `data/projectmanager.db` when the backend is running. **There is no need to manually set up or install a database server.**

## 📖 API Documentation
A complete Postman collection is included in this repository. 
Import the `TaskFlow_Postman_Collection.json` file into your Postman workspace to easily test all 8 REST API endpoints.

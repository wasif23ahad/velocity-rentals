# 🚗 Velocity Rentals

A full-stack Vehicle Rental Management System built with **React**, **Node.js**, **Express**, and **PostgreSQL**.

The system allows users to browse and book vehicles, while administrators can manage the layout, bookings, and user roles.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, TailwindCSS (assumed standard), Lucide Icons
*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
*   **Validation:** Zod
*   **Scheduler:** Node-cron (for auto-returning vehicles)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Installation

Install all dependencies for both frontend and backend (consolidated in root):

```bash
npm install
```

### 2. Database Configuration

Ensure you have a PostgreSQL database running.
The project expects a `.env` file in the **root** directory with the following variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/velocity_rentals?schema=public"
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=365d
```

### 3. Database Migration

Create the database tables using Prisma:

```bash
npx prisma migrate dev --name init
```

### 4. Running the Application

**Start the Backend Server:**
```bash
npm run server
```
*   Server runs on: `http://localhost:5000`

**Start the Frontend:**
```bash
npm run dev
```
*   Frontend runs on: `http://localhost:5173` (typically)

## 🌟 Key Features

### 🔐 Authentication
*   **Sign Up/In:** secure user registration and login.
*   **Role-Based:** separate interfaces for `Admin` and `Customer`.
*   **Security:** JWT-protected routes.

### 🚙 Vehicle Management
*   **Browse:** view available vehicles (Car, Bike, Van, SUV).
*   **Manage (Admin):** Add, update, or delete vehicles.
*   **Availability:** Real-time tracking of vehicle status.

### 📅 Booking System
*   **Book:** Customers can book vehicles for specific dates.
*   **Price Calculation:** Automatic calculation based on daily rates.
*   **Cancel:** Customers can cancel bookings (strictly before the start date).
*   **Return:** Admins can mark vehicles as returned.
*   **Auto-Return:** System automatically processes returns when the booking period ends.

### 👤 User Management
*   **Profiles:** Users can manage their own profiles.
*   **Admin Control:** Admins can manage user roles and accounts.

## 📂 Project Structure

The project has been consolidated into a single root structure:

*   `src/` (Backend Source Check `backend/src` path... wait, the backend source is in `backend/src`? No, I moved everything?
    No, in the previous step, I kept `backend/src`. Wait.
    Checking my `package.json` edit: `"server": "ts-node-dev ... backend/src/server.ts"`.
    So the code IS in `backend/src`.
    The `node_modules` are in root.
    `README.md` is in root.
    `prisma` folder is in root.
    
    Correction for Project Structure section:
    *   `prisma/`: Database Schema and Migrations
    *   `backend/src/`: Backend Source Code (Controllers, Services, Routes)
    *   `src/`: Frontend Source Code (React)
    
    Wait, `list_dir` showed `App.tsx` in **root**.
    This means the Frontend is in the root, and the Backend is in `backend/src`.
    This is a "Root Frontend + Nested Backend" hybrid, but sharing `node_modules`.
    I will describe it accurately.

*   `backend/src/`: Backend API Logic
*   `prisma/`: Database Schema
*   `src/`: Frontend React Application


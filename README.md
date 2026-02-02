# ClassFlow - Class Scheduling System

A comprehensive class scheduling and management system built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## 🚀 Features

- **Class Management**: Create, update, and manage classes with support for complex recurrence patterns (daily, weekly, monthly).
- **Calendar View**: Visual calendar interface to track classes and occurrences.
- **Resource Management**:
  - **Instructors**: Manage teaching staff and their assignments.
  - **Rooms**: Track classroom availability and locations.
  - **Branches**: Support for multiple school locations/branches.
- **Authentication**: Secure JWT-based authentication for administrators.
- **Modern UI**: Clean, responsive interface built with Material UI and Framer Motion.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit (RTK Query)
- **UI Components**: Material UI (MUI)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: Luxon & date-fns
- **Recurrence**: rrule

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JWT & bcryptjs
- **Logging**: Morgan

## 📦 Project Structure

```text
class-scheduler/
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.tsx
└── package.json        # Root workspace configuration
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd class-scheduler
   ```

2. Install dependencies for the entire project:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend/` directory:
     ```env
     PORT=5001
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_secret_key
     CORS_ORIGIN=http://localhost:5173
     ```
   - Create a `.env` file in the `frontend/` directory:
     ```env
     VITE_API_URL=http://localhost:5001
     ```

### Running the Application

You can run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5001](http://localhost:5001)

## 📄 License

This project is licensed under the ISC License.

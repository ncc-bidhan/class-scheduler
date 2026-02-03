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

## 📡 API Documentation

### Authentication

Manage user registration, login, and security.

- **POST** `/api/auth/register`: Register a new admin user.
- **POST** `/api/auth/login`: Authenticate and receive a JWT token.
- **POST** `/api/auth/change-password`: Update current user's password (Protected).

**Example Login Request:**

```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Example Login Response:**

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Admin", "email": "..." },
    "token": "eyJhbG..."
  }
}
```

### Resource Management

Manage core entities: Branches, Instructors, and Rooms. All routes follow RESTful conventions.

- **GET** `/api/branches`: List all branches.
- **POST** `/api/branches`: Create a new branch.
- **GET** `/api/instructors`: List all instructors.
- **POST** `/api/rooms`: Create a new classroom.

### Class & Scheduling

Create and manage single or recurring classes.

- **POST** `/api/classes/single`: Create a one-time class.
- **POST** `/api/classes/recurring`: Create a recurring class (daily/weekly).
- **GET** `/api/classes/occurrences`: Fetch all class occurrences within a date range (for calendar).

**Example Create Recurring Class:**

```json
{
  "name": "Morning Yoga",
  "branchId": "65b...",
  "instructorId": "65b...",
  "roomId": "65b...",
  "type": "recurring",
  "dtstart": "2024-03-01T08:00:00Z",
  "until": "2024-06-01T23:59:59Z",
  "recurrence": {
    "freq": "weekly",
    "interval": 1,
    "byWeekday": [1, 3, 5],
    "timeSlotsByWeekday": {
      "1": [{ "startTime": "08:00", "endTime": "09:00" }],
      "3": [{ "startTime": "08:00", "endTime": "09:00" }],
      "5": [{ "startTime": "08:00", "endTime": "09:00" }]
    }
  }
}
```

## 🧠 System Design & Logic

### Scheduling Logic

The system handles complex scheduling using a "Template & Expansion" model:

1. **Templates**: Classes are stored as either "single" or "recurring" definitions. Recurring classes use the [rrule](https://github.com/jakubroztocil/rrule) logic to define patterns.
2. **Dynamic Expansion**: Occurrences are not stored individually in the database. Instead, the `recurrence.service.ts` expands the templates into individual instances on-the-fly when requested (e.g., for a specific month on the calendar).
3. **Conflict Detection**: Before saving any class, the system checks for:
   - **Instructor Overlap**: An instructor cannot be in two places at once.
   - **Room Overlap**: A room cannot host two classes simultaneously.
   - **Time Validity**: Ensuring start times precede end times.

### Design Decisions

- **TypeScript**: Used end-to-end to ensure type safety, especially for complex recurrence objects.
- **Zod Validation**: Strict schema validation on the backend to prevent corrupted schedule data.
- **RTK Query**: Efficiently manages API state and caching on the frontend, reducing redundant network calls for static resources (branches, instructors).
- **MUI & Framer Motion**: Provides a professional, responsive, and interactive user experience.


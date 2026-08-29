# Task Management System

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) Task Management System with role-based access for **Admin** and **Employee** users. Admins manage employees, assign tasks, and monitor progress; employees view and update their own assigned tasks. Email notifications are sent on task assignment and status updates.

---

## Features

### Authentication & Authorization
- Separate login for Admin and Employee users (JWT-based).
- Role-based access control (RBAC): only admins can manage tasks/employees; only employees can update their own tasks.
- Proper validation of login credentials with clear error messages.

### Admin Module
- View the list of all employees.
- Assign tasks to employees with **High / Medium / Low** priority.
- Email notification to the employee whenever a task is assigned.
- Dashboard statistics: **Not Started**, **In Progress**, **Completed**.
- Table of all assigned tasks with **search** and **pagination**.
- Search matches task title *and* employee name.

### Employee Module
- Dashboard listing only tasks assigned to the logged-in employee.
- Update task status: **Not Started → In Progress → Completed**.
- Email notification to the admin whenever a task status is updated.

### Technical Highlights
- MERN stack with Mongoose ODM.
- Nodemailer email integration (Gmail App Password; no-op on failure so it never breaks the API).
- Debounced search and paginated task tables.
- Clean, responsive, mobile-friendly UI built with Tailwind CSS.
- Full validation on both frontend and backend (express-validator).
- Consistent API error handling via a global error middleware.

---

## Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| Frontend  | React (Vite), React Router v6, Axios, Tailwind CSS, react-hot-toast |
| Backend   | Node.js, Express.js                        |
| Database  | MongoDB Atlas (Mongoose ODM)               |
| Auth      | JWT (jsonwebtoken) + bcryptjs              |
| Email     | Nodemailer                                 |
| Validation| express-validator (backend), inline (frontend) |

---

## Folder Structure

```
task-management-system/
├── server/                     # Backend (Node/Express)
│   ├── config/                 # DB connection
│   ├── controllers/            # auth, employee, task logic
│   ├── middleware/             # auth, role, error, validation
│   ├── models/                 # Mongoose schemas (User, Task)
│   ├── routes/                 # API route definitions
│   ├── utils/                  # JWT, email, templates, constants
│   ├── validators/             # express-validator rules
│   ├── seed/                   # seed.js (sample data)
│   ├── .env.example
│   └── server.js
├── client/                     # Frontend (React/Vite)
│   ├── src/
│   │   ├── api/                # axios instance + interceptors
│   │   ├── components/         # common, auth, admin, employee
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Login, AdminDashboard, EmployeeDashboard
│   │   ├── services/           # API service wrappers
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm
- A MongoDB Atlas cluster (or local MongoDB)
- A Gmail account (for email notifications)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-management-system
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install
```

### 4. Configure environment variables

**Backend** (`server/`)
```bash
cp .env.example .env
```
Edit `server/.env` and fill in your values:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_NOTIFY_EMAIL=admin@example.com
CLIENT_URL=http://localhost:5173
```

**Frontend** (`client/`)
```bash
cp .env.example .env
```
Edit `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Getting a Gmail App Password (for email)
1. Enable 2-Step Verification on your Google account: https://myaccount.google.com/security
2. Go to **Security → App passwords** (https://myaccount.google.com/apppasswords).
3. Create a new app password, then copy the 16-character code into `EMAIL_PASS`.
4. Put your Gmail address in `EMAIL_USER`.
   > For local/custom SMTP testing you can instead set `EMAIL_SERVICE` to `ethereal` and use an Ethereal test account — see README "Assumptions".

---

## Running Locally

### Start the backend
```bash
cd server
npm run dev        # runs with nodemon
```

### Seed the database (optional but recommended)
```bash
cd server
npm run seed       # creates admin + 3 employees + sample tasks
```

### Start the frontend
```bash
cd client
npm run dev        # http://localhost:5173
```

Open **http://localhost:5173** and log in with one of the seeded accounts below.

---

## Demo Credentials (from seed)

| Role     | Email             | Password     |
|----------|-------------------|--------------|
| Admin    | admin@test.com    | Admin@123    |
| Employee | employee1@test.com | Employee@123 |
| Employee | employee2@test.com | Employee@123 |
| Employee | employee3@test.com | Employee@123 |

---

## API Endpoints

Base URL: `http://localhost:5000/api`
All protected routes require header: `Authorization: Bearer <token>`

| Method | Endpoint                 | Access    | Description                                  |
|--------|--------------------------|-----------|----------------------------------------------|
| POST   | `/auth/login`            | Public    | Login, returns JWT + user info               |
| GET    | `/auth/me`               | Protected | Get current authenticated user               |
| GET    | `/employees`             | Admin     | List employees (`?search=`)                  |
| POST   | `/tasks`                 | Admin     | Assign a new task (sends email)              |
| GET    | `/tasks`                 | Admin     | All tasks (`?page&limit&search&status&priority`) |
| GET    | `/tasks/stats`           | Admin     | Task status statistics                       |
| GET    | `/tasks/my-tasks`        | Employee  | Own tasks (`?page&limit&search&status`)      |
| PATCH  | `/tasks/:id/status`      | Employee  | Update task status (sends email to admin)    |

**Standard responses:**
- Success: `{ success: true, data, message?, pagination? }`
- Error: `{ success: false, message, errors? }`

---

## Known Limitations / Future Improvements

- **Email delivery** depends on valid SMTP credentials; in dev without real SMTP the email send is silently logged (never breaks the API request).
- Uses a **single admin** model; multiple admins are supported by query, but only one is seeded.
- No employee **self-registration** — admins would add employees via a future UI/admin endpoint.
- No **edit/delete** task flow for admins (only create/assign). Could be added as `PUT`/`DELETE` routes.
- File uploads for task attachments are not implemented.
- Statistics are computed live per request; could be cached/aggregated for high volume.
- No forgot-password / email verification flow.

---

## Assumptions Made

1. **Email in development**: If SMTP credentials aren't configured, the app still works — `sendEmail` catches and logs failures without failing the API. For local testing, you may set `EMAIL_SERVICE=ethereal` and generate a test account at https://ethereal.email, then provide `EMAIL_USER`/`EMAIL_PASS`. For production, use a Gmail App Password.
2. **`Status` values**: The spec lists both "Pending / In Progress" — this build uses the canonical enum `['Not Started', 'In Progress', 'Completed']` to keep state transitions simple and consistent between frontend and backend.
3. **Admin notifications**: When an employee updates a status, an email is sent to **all** users with the `admin` role.
4. **The admin's own dashboard statistics** reflect *all* tasks in the system (not filtered per admin).
5. **Assigned employees** are chosen from users whose role is `employee` only.
6. **Route order**: `/tasks/stats` and `/tasks/my-tasks` are declared before `/tasks/:id/status` to avoid route-parameter conflicts.

# TaskFlow - Scalable Task Management System

A professional Task Management application built with a focus on clean architecture, security, and scalability. This project was developed as a 3-day assignment.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login with encrypted password storage (bcrypt).
- **Responsive Dashboard**: A mobile-first UI for managing tasks and user profile information.
- **CRUD Operations**: Complete Create, Read, Update, and Delete functionality for tasks.
- **Search & Filter**: Real-time task filtering to maintain productivity as data scales.
- **Protected Routes**: Secure navigation ensuring the dashboard is only accessible to authenticated users.
- **Profile Management**: Ability for users to update their personal information.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **React Router**: Client-side routing and protected routes.
- **Tailwind CSS**: Modern, utility-first styling for a responsive UI.
- **Mock API Service**: A service-oriented architecture that allows the frontend to work offline via localStorage for demonstration purposes.

### Backend
- **Node.js & Express**: Modular API structure.
- **MongoDB & Mongoose**: Scalable NoSQL database with strict schema validation.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcrypt.js**: Industry-standard password hashing.

## 📁 Project Structure

```text
/
├── components/         # Reusable UI components
├── services/           # API and helper logic
├── types.ts            # TypeScript definitions
├── App.tsx             # Main routing and global state
├── backend/
│   └── server.js       # Production-ready Node.js logic
├── API_DOCS.md         # Detailed API endpoint documentation
└── SCALING.md          # Technical roadmap for production scaling
```

## ⚙️ How to Run

### Frontend (Live Preview)
The frontend is pre-configured to run in a preview environment. It uses a simulated backend service to allow immediate testing without a database connection.

### Backend (Submission)
The `backend/server.js` file contains the logic required for the Node.js deliverable. To deploy:
1. Initialize a Node project: `npm init`.
2. Install dependencies: `npm install express mongoose bcryptjs jsonwebtoken cors dotenv`.
3. Configure `.env` with `MONGO_URI` and `JWT_SECRET`.
4. Run with `node server.js`.

## 📈 Scalability Roadmap
For details on how this application can be scaled to support millions of users, please refer to [SCALING.md](./SCALING.md).

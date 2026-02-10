
# TaskFlow API Documentation 📖

**Base URL:** `http://localhost:5000/api`

## Authentication

### Signup
- **URL:** `/signup`
- **Method:** `POST`
- **Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Success:** `200 OK` with User object and JWT token.

### Login
- **URL:** `/login`
- **Method:** `POST`
- **Body:** `{ "email": "...", "password": "..." }`
- **Success:** `200 OK` with User object and JWT token.

## Tasks (Requires `x-auth-token` header)

### Get All Tasks
- **URL:** `/tasks`
- **Method:** `GET`
- **Success:** Array of Task objects.

### Create Task
- **URL:** `/tasks`
- **Method:** `POST`
- **Body:** `{ "title": "...", "description": "..." }`
- **Success:** The created Task object.

### Toggle Task Status
- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Success:** The updated Task object.

### Delete Task
- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Success:** `{ "msg": "Task removed" }`

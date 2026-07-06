# To do list

A full-stack task management application built with **React**, **Node.js (Express)**, and **PostgreSQL**.


## Features
- **Task Management**: Create, view, edit, and delete tasks.
- **Status Tracking**: Track tasks across 3 states: `Pending`, `On Going`, and `Completed`.
- **Advanced Filtering & Sorting**: Filter by status and search by keywords. Sort tasks by creation date, title, deadline, or status.
- **Server-Side Pagination**: Efficiently load large datasets using backend cursor-based/offset pagination.
- **Modern UI**: Built with Tailwind CSS, featuring status-specific color coding and responsive design.
- **Dockerized**: Fully containerized setup for zero-configuration deployments.

## Architecture & Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Knex.js
- **Database**: PostgreSQL 15
- **Deployment**: Docker & Docker Compose (with Nginx for frontend serving and reverse proxying).

---

## 🚀 Getting Started

There are two ways to run this application: **Using Docker (Recommended)** or **Manual Setup**.

### Option 1: Run with Docker (Recommended)

This is the easiest way to run the application. You don't need to install Node.js or PostgreSQL on your local machine, only Docker.

**Prerequisites:**
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Steps:**
1. Clone the repository and navigate to the root folder:
   ```bash
   cd SRT_Group
   ```
2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
3. Open your browser and visit:
   - **Frontend UI:** [http://localhost:8080](http://localhost:8080)
   
*Note: Nginx acts as a reverse proxy, so API requests are routed internally from `8080/api/` to the backend container. The PostgreSQL database runs on port `5432` internally.*

To stop the application, run: `docker-compose down`

---

### Option 2: Manual Local Setup

If you prefer to run the application natively without Docker, follow these steps.

**Prerequisites:**
- Node.js (v20+ or v22+ recommended)
- PostgreSQL (running locally)

#### 1. Database Setup
Ensure PostgreSQL is running and create a database named `todo_db`.
```sql
CREATE DATABASE todo_db;
```
*(Note: The backend Knex configuration will automatically create the required tables and constraints when the server starts).*

#### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (if it doesn't exist) and configure your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_db_password
   DB_NAME=todo_db
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:3000`.*

#### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. Vite is configured to automatically proxy `/api` requests to `localhost:3000`.*

---

## Testing
To run the automated API tests for the backend (which verify database constraints and API validation):
```bash
cd backend
npm test
```

## License
MIT License

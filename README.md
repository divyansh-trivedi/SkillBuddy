# SkillBuddy

SkillBuddy is an AI-powered learning platform designed to help users master new skills through structured roadmaps, quizzes, and AI mentorship.

## Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS (v4), Framer Motion, Recharts
-   **Backend:** Node.js, Express, Mongoose
-   **Database:** MongoDB 

## Features

-   **Course Library:** Browse a wide range of courses in Frontend, Backend, Data Science, and more.
-   **Interactive Roadmaps:** Track your learning progress with step-by-step roadmaps.
-   **Quizzes:** Test your knowledge with quizzes for each course.
-   **AI Chat:** Get instant answers and mentorship from an AI buddy.
-   **Dashboard:** Visualize your progress and see upcoming tasks.
-   **User Authentication:** Secure login and signup.

## Setup Instructions

### Prerequisites

-   Node.js (v14+)
-   MongoDB 

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkillBuddy
```

### 2. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory (or rename `.env.example`):
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret_key
    ```
    *Note: If running locally without a .env file, it defaults to `mongodb://localhost:27017/skillbuddy`.*

4.  **Seed the Database:**
    Populate the database with initial courses, quizzes, and roadmaps:
    ```bash
    node scripts/seed.js
    ```

5.  Start the server:
    ```bash
    npm start
    ```

### 3. Frontend Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

## Project Structure

-   `client/`: Frontend React application.
-   `server/`: Backend Express API.
    -   `models/`: Mongoose schemas (User, Course, Quiz, Roadmap, UserProgress).
    -   `routes/`: API endpoints.
    -   `scripts/`: Database seeding scripts.

## API Endpoints

-   `GET /api/courses`: Get all courses.
-   `GET /api/quizzes`: Get available quizzes.
-   `GET /api/quizzes/:courseTitle`: Get specific quiz.
-   `GET /api/roadmaps/:courseTitle`: Get specific roadmap.
-   `GET /api/progress`: Get user progress (Auth required).
-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/login`: Login.

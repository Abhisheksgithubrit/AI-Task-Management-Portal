# AI-Powered Task Management Portal

Full-stack task management application with JWT authentication, user-specific tasks, and Google Gemini AI integration for automated task description, priority, and time estimation.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, MySQL, Maven |
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router |
| AI | Google Gemini API |

## Architecture

Layered architecture with clear separation:

```
Controller → Service → Repository → Database
     ↓
   DTO / Validation / Exception Handling
```

- **Controller Layer**: REST endpoints (`AuthController`, `TaskController`, `AiController`)
- **Service Layer**: Business logic (`AuthService`, `TaskService`, `GeminiAiService`)
- **Repository Layer**: JPA repositories
- **DTO Layer**: Request/response objects with validation
- **Security**: JWT filter, BCrypt password hashing, protected routes

## Project Structure

```
ai-task-management-portal/
├── backend/          # Spring Boot API
├── frontend/         # React + Vite UI
├── database/         # SQL schema
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

## Database Setup

1. Start MySQL server.
2. Optional: run `database/schema.sql` or let Spring Boot auto-create tables (`ddl-auto=update`).

```sql
CREATE DATABASE task_portal;
```

## Backend Setup & Run

```powershell
cd backend

# Optional: set environment variables
$env:DB_PASSWORD="your_mysql_password"
$env:GEMINI_API_KEY="your_gemini_api_key"
$env:JWT_SECRET="YourSecretKeyMustBeAtLeast32CharactersLong!"

mvn clean install -DskipTests
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

## Frontend Setup & Run

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Environment Variables (Frontend)

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & receive JWT |

### Tasks (Protected – Bearer Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| GET | `/api/tasks/stats` | Task statistics |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

### AI (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate description, priority, estimated time |

**AI Request Example:**

```json
{ "title": "Prepare client presentation" }
```

**AI Response Example:**

```json
{
  "description": "Generated task description",
  "priority": "HIGH",
  "estimatedTime": "4 Hours",
  "aiGenerated": true
}
```

If Gemini fails, the API returns sensible fallback values with `aiGenerated: false`.

## AI Integration

- Uses **Google Gemini 1.5 Flash** via REST API (configurable in `application.properties`)
- Prompt instructs the model to return structured JSON
- **Graceful fallback** when API is unavailable or returns invalid data
- Frontend **Generate AI** button auto-fills description, priority, and estimated time

## Database Schema (ER Overview)

```
users (1) ──────< (N) tasks
```

| users | tasks |
|-------|-------|
| id | id |
| name | title |
| email | description |
| password | priority |
| created_at | due_date |
| | status |
| | created_at |
| | user_id (FK) |

## Security

- Passwords hashed with **BCrypt**
- **JWT** bearer token for protected APIs
- CORS configured for `http://localhost:5173`
- Use environment variables for secrets in production

## Screenshots

<img width="1600" height="727" alt="image" src="https://github.com/user-attachments/assets/4f107d3f-e94b-4296-9880-aa1885964d07" />
<img width="1600" height="812" alt="image" src="https://github.com/user-attachments/assets/cd72f32a-d3b9-470c-a551-f42c52de9151" />
<img width="1600" height="732" alt="image" src="https://github.com/user-attachments/assets/0e6b14a0-b01b-4017-b0ec-d59f77209358" />
<img width="1146" height="873" alt="image" src="https://github.com/user-attachments/assets/6ff81fc6-1e39-43c3-84dd-700108edac4c" />
<img width="1583" height="838" alt="image" src="https://github.com/user-attachments/assets/fda7fa68-3344-423a-b93b-5570911e602f" />
<img width="1422" height="806" alt="image" src="https://github.com/user-attachments/assets/0396a02b-6886-4a29-9523-09239c0ea917" />
<img width="1578" height="298" alt="image" src="https://github.com/user-attachments/assets/173bd609-956d-48ba-8b37-50e14e66e8a5" />

## Demo Video Checklist

1. Register / Login flow
2. Create task with AI Generate
3. Edit, status update, delete
4. Task statistics
5. Architecture overview

## License

MIT – for educational / assignment purposes.

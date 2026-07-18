<div align="center">

# StackSentry Technologies

**Enterprise Recruitment Management System**

[![CI](https://github.com/stacksentry/stacksentry/actions/workflows/ci.yml/badge.svg)](https://github.com/stacksentry/stacksentry/actions/workflows/ci.yml)
[![Deploy](https://github.com/stacksentry/stacksentry/actions/workflows/deploy.yml/badge.svg)](https://github.com/stacksentry/stacksentry/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

</div>

---

## Screenshots

> Screenshots will be added after UI development is complete.

<!-- 
### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Job Listings
![Job Listings](docs/screenshots/jobs.png)

### Application Tracking
![Applications](docs/screenshots/applications.png)
-->

---

## Features

### For Candidates
- User registration with email verification
- Profile management with resume upload
- Advanced job search with filters (location, type, department)
- One-click job application with cover letter
- Application tracking dashboard
- Email notifications for application status updates

### For HR / Recruiters
- Job posting creation and management
- Applicant tracking system (ATS)
- Resume screening and candidate evaluation
- Interview scheduling and management
- Candidate communication
- Analytics and reporting dashboard

### For Admins
- Role-based access control (Admin, HR, Candidate)
- User management (activate, deactivate, role assignment)
- Company and department management
- System configuration
- Audit log tracking
- Email template management

### Technical Features
- JWT-based authentication with refresh tokens
- Async PostgreSQL with SQLAlchemy
- RESTful API with OpenAPI documentation
- Rate limiting and request throttling
- File upload with local storage and S3 support
- Email notifications (SMTP)
- Database migrations with Alembic
- Comprehensive test suite
- Docker containerization
- CI/CD pipeline with GitHub Actions

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.12 | Runtime |
| FastAPI | Web framework |
| SQLAlchemy 2.0 | ORM (async) |
| Alembic | Database migrations |
| PostgreSQL 16 | Database |
| Pydantic | Data validation |
| python-jose | JWT tokens |
| passlib + argon2 | Password hashing |
| uvicorn | ASGI server |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Zustand | State management |
| React Query | Data fetching |
| Axios | HTTP client |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy |
| GitHub Actions | CI/CD |
| PostgreSQL | Database |

---

## Prerequisites

- **Docker** >= 24.0 and **Docker Compose** >= 2.20
- **Python** >= 3.12 (for local development)
- **Node.js** >= 20 and **npm** >= 10 (for local development)
- **Git** >= 2.40

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/stacksentry/stacksentry.git
cd stacksentry
```

### 2. Run the setup script

```bash
# Make scripts executable (Linux/macOS)
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh

# For development mode with hot reload
./scripts/setup.sh --dev
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Nginx Proxy | http://localhost:80 |

**Default Admin Credentials:**
- Email: `admin@stacksentry.com`
- Password: `Admin@123`

---

## Development Setup

### Backend (without Docker)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Setup .env
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Seed admin user
python -m app.seeds.admin

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend (without Docker)

```bash
cd frontend

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and get tokens |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/jobs` | List all jobs |
| POST | `/api/v1/jobs` | Create a job (HR/Admin) |
| GET | `/api/v1/applications` | List applications |
| POST | `/api/v1/applications` | Submit an application |
| GET | `/api/v1/users/me` | Get current user profile |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql+asyncpg://postgres:postgres@localhost:5432/stacksentry` |
| `SECRET_KEY` | JWT access token signing key | **Required** |
| `REFRESH_SECRET_KEY` | JWT refresh token signing key | **Required** |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000,http://localhost:5173` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USERNAME` | SMTP username | - |
| `SMTP_PASSWORD` | SMTP password | - |
| `SMTP_FROM_EMAIL` | Sender email address | `noreply@stacksentry.com` |
| `AWS_S3_BUCKET` | S3 bucket for file storage | - |
| `AWS_S3_REGION` | AWS region | `ap-south-1` |
| `AWS_S3_ACCESS_KEY` | AWS access key | - |
| `AWS_S3_SECRET_KEY` | AWS secret key | - |
| `UPLOAD_DIR` | Local upload directory | `uploads` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5MB) |
| `RATE_LIMIT` | API rate limit | `100/minute` |
| `CAPTCHA_SECRET` | reCAPTCHA secret key | - |
| `ENVIRONMENT` | App environment | `development` |
| `APP_URL` | Application base URL | `http://localhost:8000` |

See [`.env.example`](.env.example) for a complete list.

---

## Deployment

### Docker Deployment (Recommended)

```bash
# Production
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend
```

### Manual Deployment

1. Set up PostgreSQL database
2. Configure nginx as reverse proxy
3. Deploy backend with uvicorn behind nginx
4. Build and serve frontend with nginx
5. Set up SSL certificates (Let's Encrypt recommended)
6. Configure systemd services or PM2 for process management

### Database Backups

```bash
# Run backup script
./scripts/backup.sh

# Restore from backup
gunzip -c backups/stacksentry_YYYYMMDD_HHMMSS.sql.gz | \
    docker compose exec -T db psql -U postgres -d stacksentry
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**StackSentry Technologies**

- Website: [https://stacksentry.com](https://stacksentry.com)
- Email: contact@stacksentry.com
- GitHub: [https://github.com/stacksentry](https://github.com/stacksentry)

---

<div align="center">
  Built with care by the StackSentry Team
</div>

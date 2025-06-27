# Real Estate Crawler System

A comprehensive web crawler system for real estate listings with a React frontend and Python FastAPI backend.

## Features

- Asynchronous web crawling of real estate listings from multiple sources
- User authentication with JWT
- Job management for crawling tasks
- Interactive dashboard with statistics
- Listing overview with filtering and sorting
- Scheduled crawling jobs with Celery

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API requests
- JWT authentication

### Backend
- FastAPI for REST API
- SQLAlchemy for database ORM
- PostgreSQL for data storage
- aiohttp for asynchronous HTTP requests
- BeautifulSoup for HTML parsing
- Celery for task queue and scheduling
- Redis for message broker
- JWT for authentication

## Project Structure

```
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Python FastAPI backend
│   ├── main.py              # Main application entry point
│   ├── database.py          # Database connection and setup
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crawler.py           # Web crawler implementation
│   ├── tasks.py             # Celery tasks
│   └── requirements.txt     # Backend dependencies
│
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.frontend      # Frontend Docker configuration
└── Dockerfile.backend       # Backend Docker configuration
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.11+ (for local development)

### Running with Docker

1. Clone the repository
2. Navigate to the project directory
3. Run Docker Compose:

```bash
docker-compose up
```

This will start all services:
- Frontend at http://localhost:3000
- Backend API at http://localhost:8000
- PostgreSQL database
- Redis for Celery
- Celery worker and beat scheduler

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token

### Jobs
- GET /api/jobs - Get all jobs for current user
- POST /api/jobs - Create a new job
- GET /api/jobs/{job_id} - Get job details
- PUT /api/jobs/{job_id} - Update job
- DELETE /api/jobs/{job_id} - Delete job

### Listings
- GET /api/listings - Get listings with filters
- GET /api/listings/{listing_id} - Get listing details

### Statistics
- GET /api/stats/dashboard - Get dashboard statistics
- GET /api/stats/jobs/{job_id} - Get job statistics

## Security Considerations

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Role-based access control
- CORS configuration for API security
- Rate limiting to prevent abuse
- Proper error handling and logging

## Anti-Scraping Measures

To avoid being blocked by websites:

1. Add random delays between requests
2. Rotate user agents
3. Implement proxy rotation
4. Respect robots.txt
5. Implement exponential backoff for retries

## GDPR Compliance

For GDPR compliance:

1. Implement user data deletion
2. Add privacy policy
3. Store only necessary data
4. Implement data retention policies
5. Add consent mechanisms

## Extending the System

- Add more crawler implementations for other websites
- Implement email notifications for completed jobs
- Add more advanced filtering and search capabilities
- Implement data export functionality
- Add machine learning for property price prediction

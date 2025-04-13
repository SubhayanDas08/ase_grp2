
# Overview

This is the backend portion of the project. It provides secure and scalable APIs to support the frontend applications. It uses modern web technologies such as Node.js, Express, and PostgreSQL, and includes tools for authentication, caching, testing, and monitoring.

# Project Structure

Below is a high-level overview of the repository structure:

```bash
backend/
├── .env                              # Environment variables
├── docker-compose.yml                # Development Docker setup
├── docker-compose-prod.yml           # Production Docker setup
├── docker-compose-monitoring.yml     # Monitoring tools setup
├── node/
│   ├── controllers/                  # API logic handlers
│   ├── middleware/                   # Middleware (e.g. auth, metrics)
│   ├── routes/                       # API endpoint definitions
│   ├── services/                     # Business logic and services
│   ├── utils/                        # Utility functions
│   ├── models/                       # Database models
│   ├── config/                       # App configuration
│   ├── index.ts                      # Entry point
├── tests/                            # Unit and integration tests
```

# Technologies

- **Node.js & Express.js** – Server-side runtime and API framework  
- **TypeScript** – Strongly typed JavaScript for safer development  
- **PostgreSQL** – Relational database for persistent data storage  
- **Redis** – Caching layer for performance optimization  
- **JWT** – Secure authentication  
- **Docker & Docker Compose** – Containerized development and deployment  
- **Jest** – Test suite for backend logic  
- **Prometheus & Grafana** – Monitoring and metrics visualization

# Setup Instructions

## Initial Setup
1. **Install Dependencies**

```bash
cd backend/node
npm install
```

2. **Environment Variables**

- Create `.env` files at the root (`backend/`) and in the `node` directory (`backend/node/`) based on your configuration requirements.

3. **Database Initialization**

- Execute the SQL scripts provided:
```bash
psql -U youruser -d yourdb -f sql/databaseSetup.sql
```
- To create tables, first run setup postgres then run the following command:
```bash
docker exec -i postgres_db psql -U postgres -d userdb < backend/node/databaseSetup.sql
```

## Running the Application
### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm run start
```

## Docker Setup
### Local Development

```bash
docker-compose up --build
```

### Production Deployment

```bash
docker-compose -f docker-compose-prod.yml up --build
```

### Monitoring Setup

```bash
docker-compose -f docker-compose-monitoring.yml up
```

## Testing

- Run tests using Jest:

```bash
npm test
```

- Generate test coverage:

```bash
npm run coverage
```

## Monitoring

- Metrics are available via `Prometheus` and visualized using `Grafana`. Ensure monitoring containers are up as described in Docker Setup.
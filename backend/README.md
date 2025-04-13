Backend README

Overview

This document provides detailed information about the backend codebase for the Advanced Software Engineering project. The backend utilizes Node.js, TypeScript, and Express.js to deliver secure and scalable APIs.

Technologies
	•	Node.js & Express.js: API creation and request handling
	•	TypeScript: Type-safe JavaScript development
	•	PostgreSQL: Database management
	•	Redis: Caching
	•	JWT: Authentication and security
	•	Docker & Docker Compose: Containerization and deployment
	•	Jest: Testing
	•	Prometheus & Grafana: Monitoring and metrics visualization

Project Structure

backend/
├── .env                  # Environment variables
├── docker-compose.yml    # Development Docker setup
├── docker-compose-prod.yml # Production Docker setup
├── docker-compose-monitoring.yml # Monitoring tools setup
├── node/
│   ├── controllers/      # API logic handlers
│   ├── middleware/       # Middleware components (e.g., auth, metrics)
│   ├── routes/           # API endpoint routes
│   ├── services/         # Database and external API integrations
│   ├── utils/            # Helper functions and configurations
│   ├── interceptors/     # Data encryption handlers
│   ├── interfaces/       # Type definitions
│   ├── Tests/            # Additional unit tests
│   ├── __tests__/        # Jest-based unit tests
│   ├── sql/              # Database initialization and reset scripts
│   ├── Dockerfile        # Dockerfile for Node.js app
│   ├── babel.config.js   # Babel transpilation configuration
│   ├── package.json      # Project dependencies and scripts
│   └── nginx.conf        # Reverse proxy configuration
└── grafana/
    └── provisioning/     # Grafana monitoring setup

Setup Instructions

Initial Setup
	1.	Install Dependencies

cd backend/node
npm install

	2.	Environment Variables

	•	Create .env files at the root (backend/) and in the node directory (backend/node/) based on your configuration requirements.

	3.	Database Initialization

	•	Execute the SQL scripts provided:

psql -U youruser -d yourdb -f sql/databaseSetup.sql

To create Tables, first run setup postgres
then run the following command
docker exec -i postgres_db psql -U postgres -d userdb < backend/node/databaseSetup.sql


Running the Application
	•	Development:

npm run dev

	•	Production:

npm run build
npm start

Docker Setup
	•	Local Development:

docker-compose up --build

	•	Production Deployment:

docker-compose -f docker-compose-prod.yml up --build

	•	Monitoring Setup:

docker-compose -f docker-compose-monitoring.yml up

Testing
	•	Run tests using Jest:

npm test

	•	Generate test coverage:

npm run coverage

Monitoring
	•	Metrics are available via Prometheus and visualized using Grafana. Ensure monitoring containers are up as described in Docker Setup.

Contribution
	•	Follow coding standards and maintain coverage with Jest tests.
	•	Submit changes via Pull Requests for review.

License
	•	ISC License. See LICENSE file for details.

Contact
	•	For questions or support, reach out to the repository maintainer or use the provided project documentation channels.

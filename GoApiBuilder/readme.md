# Project Description

GoAPIBuilder is a CLI application written in Golang designed to simplify the process of generating RESTful APIs. The tool allows users to create a database and four essential API endpoints—create, read, update, and delete (CRUD)—with minimal input. The user interacts with the application through the command line, specifying the type of API they want to generate, and GoAPIBuilder takes care of the rest.

# Features

- CLI Interaction: The application prompts the user to specify the type of API they want to generate.
- Database Setup: Automatically creates a database and necessary tables based on user input.
- CRUD Endpoints: Generates the standard CRUD endpoints for the specified API.
- Configuration Options: Allows users to customize database configurations (e.g., PostgreSQL, MySQL, SQLite).
- API Documentation: Automatically generates API documentation using Swagger.
- Authentication: Optional JWT-based authentication for the generated API.
- Docker Integration: Generates a Dockerfile and docker-compose configuration for easy deployment.
- Unit Tests: Creates basic unit tests for the generated endpoints.
- Logging: Includes logging functionality for monitoring API requests and errors.
- Error Handling: Robust error handling with meaningful error messages.
- Environment Configuration: Supports environment-based configurations (development, testing, production).
- Custom Middleware: Ability to add custom middleware for additional functionality.
- Version Control: Generates versioned APIs to support backward compatibility.
- Rate Limiting: Optional rate limiting feature to prevent abuse.

## Project Structure

```shell
GoAPIBuilder/
├── cmd/
│ └── goapibuilder/
│ ├── main.go
├── internal/
│ ├── api/
│ │ ├── handler.go
│ │ ├── router.go
│ ├── config/
│ │ ├── config.go
│ ├── db/
│ │ ├── db.go
│ │ ├── migrations/
│ │ │ └── create_initial_schema.sql
│ ├── middleware/
│ │ ├── auth.go
│ │ ├── logging.go
│ ├── models/
│ │ ├── model.go
│ ├── tests/
│ │ ├── api_test.go
├── templates/
│ ├── docker/
│ │ ├── Dockerfile
│ │ ├── docker-compose.yml
│ ├── swagger/
│ │ ├── swagger.yml
├── README.md
├── go.mod
└── go.sum
```

## Example Workflow

```
Run the CLI Application:

- go run cmd/goapibuilder/main.go

User Prompts:

Welcome to GoAPIBuilder!
What type of API do you want to generate?

1. Simple CRUD
2. CRUD with Authentication
3. Custom API

> 1

Enter the database type (PostgreSQL/MySQL/SQLite):

> PostgreSQL

Enter the database name:

> mydatabase

Enter the API version (e.g., v1):

> v1

Generating your API...

API generated successfully!
Generated API:

A PostgreSQL database is created.
CRUD endpoints are set up.
A Dockerfile and docker-compose.yml are generated for easy deployment.
Swagger documentation is available for the API.
```

## Implementation Details

CLI Interaction: Use the cobra library for creating the CLI application.
Database Setup: Use gorm for ORM and database migrations.
CRUD Endpoints: Implement RESTful endpoints using the gorilla/mux package.
Authentication: Implement JWT authentication using the dgrijalva/jwt-go package.
Swagger Documentation: Use the swaggo/swag library for generating Swagger docs.
Docker Integration: Create Dockerfile and docker-compose templates for containerization.
Unit Tests: Use the testing package in Golang for writing unit tests.
Logging: Use the logrus package for logging.

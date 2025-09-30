# Teable Golang Backend

A collaborative spreadsheet platform backend built with Domain-Driven Design (DDD) in Go, refactored from the original NestJS implementation.

## 🎯 Project Overview

Teable is a collaborative table platform similar to Airtable, featuring complex domain models and business rules for managing bases, tables, fields, records, and views.

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** principles with a clean architecture:

```
go-backend/
├── cmd/
│   └── api/                    # Application entry point
├── internal/
│   ├── domain/                 # Domain Layer (Business Logic)
│   │   ├── base/
│   │   ├── table/
│   │   ├── field/
│   │   ├── record/
│   │   ├── view/
│   │   ├── user/
│   │   └── shared/            # Shared domain models & value objects
│   ├── application/           # Application Layer (Use Cases)
│   │   ├── service/
│   │   └── dto/
│   ├── infrastructure/        # Infrastructure Layer
│   │   ├── persistence/       # Database implementations
│   │   ├── cache/            # Redis implementations
│   │   ├── storage/          # MinIO implementations
│   │   ├── messaging/        # Pub/Sub implementations
│   │   └── websocket/        # WebSocket handlers
│   └── interfaces/            # Interface Layer (API)
│       ├── http/             # REST API handlers
│       ├── websocket/        # WebSocket handlers
│       └── middleware/       # Gin middlewares
├── pkg/                       # Shared packages
│   ├── config/
│   ├── logger/
│   ├── errors/
│   └── utils/
└── tests/                     # Integration & E2E tests
```

### DDD Layers Explained

1. **Domain Layer** - Core business logic, entities, aggregates, value objects, domain services
2. **Application Layer** - Use cases, orchestration of domain operations, DTOs
3. **Infrastructure Layer** - External dependencies (DB, Cache, Storage, etc.)
4. **Interface Layer** - HTTP/WebSocket handlers, middleware, API contracts

## 🛠️ Technology Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Object Storage**: MinIO
- **Real-time**: WebSocket + Redis Pub/Sub
- **Authentication**: JWT + OAuth2
- **Logging**: Logrus

## 📦 Key Features

- ✅ **Bases Management** - Create and manage workspaces
- ✅ **Tables** - Dynamic table creation with schema management
- ✅ **Fields** - Multiple field types (Text, Number, Date, Attachment, Link, etc.)
- ✅ **Records** - CRUD operations with validation and indexing
- ✅ **Views** - Multiple view types (Grid, Kanban, Gallery, Calendar)
- ✅ **Filtering & Sorting** - Advanced query capabilities
- ✅ **Collaboration** - Real-time updates via WebSocket
- ✅ **File Storage** - Attachment handling with MinIO
- ✅ **Access Control** - User authentication and authorization

## 🚀 Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 14+
- Redis 7+
- MinIO (or S3-compatible storage)

### Installation

```bash
# Clone the repository
cd go-backend

# Install dependencies
go mod download

# Copy environment file
cp configs/config.example.yaml configs/config.yaml

# Run database migrations
go run cmd/migrate/main.go

# Start the server
go run cmd/api/main.go
```

### Configuration

Edit `configs/config.yaml`:

```yaml
server:
  port: 8080
  mode: debug

database:
  host: localhost
  port: 5432
  user: postgres
  password: postgres
  database: teable
  
redis:
  addr: localhost:6379
  password: ""
  db: 0

storage:
  endpoint: localhost:9000
  access_key: minioadmin
  secret_key: minioadmin
  use_ssl: false
```

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8080/swagger/index.html`
- Health Check: `http://localhost:8080/health`

## 🧪 Testing

```bash
# Run unit tests
go test ./internal/domain/...

# Run integration tests
go test ./tests/integration/...

# Run with coverage
go test -cover ./...
```

## 🏛️ Domain Models

### Core Aggregates

1. **Base Aggregate** - Workspace/Database container
2. **Table Aggregate** - Table definition with fields and views
3. **Record Aggregate** - Data rows with field values
4. **View Aggregate** - Table view configuration (Grid, Kanban, etc.)
5. **User Aggregate** - User authentication and profile

### Key Value Objects

- `FieldType` - Enumeration of field types
- `CellValue` - Polymorphic field value representation
- `Filter` - Query filter criteria
- `Sort` - Sorting configuration

## 🔄 Migration from NestJS

This project maintains API compatibility with the original NestJS implementation:

- Same REST endpoints
- Same request/response formats
- Same WebSocket events
- Same database schema

## 📖 Development Guide

### Adding a New Feature

1. **Domain Layer**: Define entities, value objects, and domain services
2. **Application Layer**: Create use cases and DTOs
3. **Infrastructure Layer**: Implement repositories and external integrations
4. **Interface Layer**: Add HTTP handlers and routes

### Code Style

- Follow Go best practices
- Use descriptive names
- Write tests for all business logic
- Document public APIs

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](../AGPL_LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## 📞 Support

- GitHub Issues: [https://github.com/teableio/teable/issues](https://github.com/teableio/teable/issues)
- Documentation: [https://help.teable.io](https://help.teable.io)

---

**Built with ❤️ using Domain-Driven Design in Go**
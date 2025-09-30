# Quick Start Guide

Get the Teable Golang backend up and running in minutes!

## Prerequisites

- Go 1.21 or later
- Docker and Docker Compose (for services)
- Make (optional, but recommended)

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Configuration

```bash
# Copy example configuration
cp configs/config.example.yaml configs/config.yaml

# Optional: Edit configuration if needed
# vim configs/config.yaml
```

### Step 2: Start Services

```bash
# Start PostgreSQL, Redis, and MinIO
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Step 3: Install Dependencies

```bash
# Download Go dependencies
go mod download
```

### Step 4: Run the Application

```bash
# Option 1: Using Make (recommended)
make run

# Option 2: Using go run directly
go run cmd/api/main.go
```

### Step 5: Test the API

```bash
# Health check
curl http://localhost:8080/health

# Expected response:
# {"status":"ok","service":"teable-go"}
```

🎉 **You're running!** The API is now available at `http://localhost:8080`

---

## 📋 Common Commands

### Development

```bash
# Run in development mode
make run

# Run with auto-reload (using air)
air

# Run tests
make test

# Run tests with coverage
make test-coverage
```

### Building

```bash
# Build production binary
make build

# Run the binary
./bin/api

# Build for different platforms
GOOS=linux GOARCH=amd64 go build -o bin/api-linux cmd/api/main.go
```

### Docker

```bash
# Start all services
make docker-up

# Stop all services
make docker-down

# View logs
make docker-logs

# Rebuild and restart
docker-compose up -d --build
```

### Database

```bash
# Run migrations
go run cmd/migrate/main.go -action=up

# Rollback migrations
go run cmd/migrate/main.go -action=down

# Check migration status
go run cmd/migrate/main.go -action=status
```

---

## 🧪 Testing the API

### Create a Table

```bash
# Note: You'll need a valid JWT token for protected endpoints
# For testing, you can temporarily disable auth in the router

curl -X POST http://localhost:8080/api/bases/bse123/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My First Table",
    "description": "A test table",
    "icon": "📊"
  }'
```

### Get Tables

```bash
curl http://localhost:8080/api/bases/bse123/tables \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Table

```bash
curl -X PATCH http://localhost:8080/api/tables/tblXXXXXXXXXXXXXXXX \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Table Name"
  }'
```

### Delete a Table

```bash
curl -X DELETE http://localhost:8080/api/tables/tblXXXXXXXXXXXXXXXX \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Override config with environment variables
export SERVER_PORT=8080
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export REDIS_ADDR=localhost:6379
```

### Config File (`configs/config.yaml`)

```yaml
server:
  port: 8080
  mode: debug  # debug, release, test

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

jwt:
  secret: your-secret-key-change-in-production
  expiry: 24h
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t teable-go:latest .

# Run container
docker run -p 8080:8080 \
  -e DATABASE_HOST=postgres \
  -e REDIS_ADDR=redis:6379 \
  teable-go:latest
```

### Docker Compose Production

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_HOST=postgres
      - REDIS_ADDR=redis:6379
    depends_on:
      - postgres
      - redis
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Change port in configs/config.yaml
server:
  port: 8081  # Use different port
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
docker-compose logs postgres

# Test connection
psql -h localhost -U postgres -d teable
```

### Redis Connection Failed

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost ping
```

### Cannot Find Config File

```bash
# Make sure you're in the project root
cd go-backend

# Config file should be at
ls configs/config.yaml
```

---

## 📊 Monitoring

### View Logs

```bash
# Application logs (if logging to file)
tail -f logs/app.log

# Docker logs
docker-compose logs -f api
```

### Check Health

```bash
# Health endpoint
curl http://localhost:8080/health

# Database connection
curl http://localhost:8080/health/db

# Redis connection
curl http://localhost:8080/health/redis
```

---

## 🧹 Cleanup

### Stop Services

```bash
# Stop all Docker services
make docker-down

# Or manually
docker-compose down
```

### Remove Data

```bash
# Remove Docker volumes (CAUTION: deletes all data)
docker-compose down -v

# Clean build artifacts
make clean
```

---

## 📚 Next Steps

1. **Read the Documentation**
   - [DDD Architecture](docs/DDD_ARCHITECTURE.md)
   - [Migration Guide](docs/MIGRATION_GUIDE.md)
   - [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

2. **Explore the Code**
   - Domain models: `internal/domain/`
   - API handlers: `internal/interfaces/http/handler/`
   - Services: `internal/application/service/`

3. **Run Tests**
   ```bash
   make test
   ```

4. **Add Features**
   - Follow the DDD structure
   - Add new domain entities
   - Create corresponding services and handlers

---

## 🆘 Getting Help

### Documentation
- [Main README](README.md)
- [Architecture Guide](docs/DDD_ARCHITECTURE.md)
- [Migration Guide](docs/MIGRATION_GUIDE.md)

### Common Issues
- Check Docker containers are running: `docker-compose ps`
- Check logs: `docker-compose logs`
- Verify configuration: `cat configs/config.yaml`

### Development Tips
```bash
# Format code
make fmt

# Run linter
make lint

# Generate code coverage
make test-coverage

# Build and run
make build && ./bin/api
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] PostgreSQL is running (`docker-compose ps postgres`)
- [ ] Redis is running (`docker-compose ps redis`)
- [ ] MinIO is running (`docker-compose ps minio`)
- [ ] Configuration file exists (`ls configs/config.yaml`)
- [ ] Dependencies installed (`go mod download`)
- [ ] Application starts (`make run`)
- [ ] Health check passes (`curl http://localhost:8080/health`)

---

**Happy Coding!** 🚀

For questions or issues, please check the [documentation](docs/) or create an issue on GitHub.
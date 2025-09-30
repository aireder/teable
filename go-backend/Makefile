.PHONY: help build run test clean migrate docker-up docker-down

help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build the application
	@echo "Building application..."
	@go build -o bin/api cmd/api/main.go
	@go build -o bin/migrate cmd/migrate/main.go

run: ## Run the application
	@echo "Running application..."
	@go run cmd/api/main.go

test: ## Run tests
	@echo "Running tests..."
	@go test -v -race -coverprofile=coverage.txt -covermode=atomic ./...

test-coverage: test ## Run tests with coverage report
	@go tool cover -html=coverage.txt -o coverage.html
	@echo "Coverage report generated: coverage.html"

clean: ## Clean build artifacts
	@echo "Cleaning..."
	@rm -rf bin/
	@rm -f coverage.txt coverage.html

migrate-up: ## Run database migrations up
	@echo "Running migrations..."
	@go run cmd/migrate/main.go up

migrate-down: ## Run database migrations down
	@echo "Rolling back migrations..."
	@go run cmd/migrate/main.go down

migrate-create: ## Create a new migration (usage: make migrate-create name=create_users_table)
	@if [ -z "$(name)" ]; then echo "Error: name is required. Usage: make migrate-create name=migration_name"; exit 1; fi
	@echo "Creating migration: $(name)"
	@mkdir -p migrations
	@touch migrations/$$(date +%Y%m%d%H%M%S)_$(name).up.sql
	@touch migrations/$$(date +%Y%m%d%H%M%S)_$(name).down.sql

docker-up: ## Start docker containers
	@echo "Starting Docker containers..."
	@docker-compose up -d

docker-down: ## Stop docker containers
	@echo "Stopping Docker containers..."
	@docker-compose down

docker-logs: ## View docker logs
	@docker-compose logs -f

lint: ## Run linters
	@echo "Running linters..."
	@golangci-lint run ./...

fmt: ## Format code
	@echo "Formatting code..."
	@go fmt ./...
	@goimports -w .

mod-tidy: ## Tidy go modules
	@echo "Tidying modules..."
	@go mod tidy

generate: ## Run go generate
	@echo "Running go generate..."
	@go generate ./...

dev: docker-up migrate-up run ## Start development environment

.DEFAULT_GOAL := help
# Domain-Driven Design Architecture

This document explains the DDD architecture used in the Teable Golang backend.

## Table of Contents

1. [Overview](#overview)
2. [Layer Architecture](#layer-architecture)
3. [Domain Layer](#domain-layer)
4. [Application Layer](#application-layer)
5. [Infrastructure Layer](#infrastructure-layer)
6. [Interface Layer](#interface-layer)
7. [Data Flow](#data-flow)

## Overview

The Teable Golang backend follows **Domain-Driven Design (DDD)** principles with a clean, layered architecture. This approach separates business logic from infrastructure concerns, making the codebase more maintainable, testable, and scalable.

### Key Principles

- **Ubiquitous Language**: Domain concepts are consistently named across code and documentation
- **Bounded Contexts**: Clear boundaries between different business domains
- **Aggregates**: Clusters of domain objects treated as a single unit
- **Repository Pattern**: Abstraction for data persistence
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## Layer Architecture

```
┌─────────────────────────────────────────┐
│         Interface Layer                 │  ← HTTP Handlers, WebSocket, gRPC
├─────────────────────────────────────────┤
│         Application Layer               │  ← Use Cases, DTOs, Orchestration
├─────────────────────────────────────────┤
│         Domain Layer                    │  ← Business Logic, Entities, Rules
├─────────────────────────────────────────┤
│         Infrastructure Layer            │  ← DB, Cache, Storage, External APIs
└─────────────────────────────────────────┘
```

### Dependency Rules

- **Domain Layer**: No dependencies on other layers (pure business logic)
- **Application Layer**: Depends only on Domain Layer
- **Infrastructure Layer**: Implements interfaces defined in Domain Layer
- **Interface Layer**: Depends on Application and Infrastructure layers

## Domain Layer

**Location**: `internal/domain/`

The heart of the application containing business logic and rules.

### Components

#### 1. Entities

Entities are objects with a unique identity that persists over time.

```go
// Table Entity (Aggregate Root)
type Table struct {
    shared.BaseEntity
    BaseID      string
    Name        string
    DbTableName string
    Version     int
    // ... other fields
}
```

**Characteristics**:
- Have unique IDs
- Contain business logic methods
- Encapsulate business rules
- Maintain consistency

#### 2. Value Objects

Immutable objects defined by their values, not identity.

```go
type FieldType string
type Filter struct {
    Conjunction string
    FilterSet   []FilterItem
}
```

**Characteristics**:
- No unique identity
- Immutable
- Can be shared
- Validated on creation

#### 3. Aggregates

A cluster of entities and value objects treated as a unit.

```
Table Aggregate:
  ├── Table (Root)
  ├── Fields (Entities)
  └── Views (Entities)
```

**Rules**:
- External objects can only reference the aggregate root
- Changes to the aggregate go through the root
- Maintains consistency boundaries

#### 4. Domain Services

Operations that don't naturally belong to an entity.

```go
type ValidationService interface {
    ValidateFieldValue(field *Field, value interface{}) error
}
```

#### 5. Repository Interfaces

Defined in domain layer, implemented in infrastructure.

```go
type TableRepository interface {
    Create(table *Table) error
    FindByID(id string) (*Table, error)
    Update(table *Table) error
}
```

### Domain Models

#### Base Aggregate
- **Purpose**: Workspace/Database container
- **Entities**: Base
- **Relationships**: Contains Tables

#### Table Aggregate
- **Purpose**: Table definition with schema
- **Root**: Table
- **Entities**: Field, View
- **Relationships**: Belongs to Base, contains Records

#### Record Aggregate
- **Purpose**: Data storage
- **Root**: Record
- **Relationships**: Belongs to Table

#### User Aggregate
- **Purpose**: User management
- **Root**: User
- **Relationships**: Independent

## Application Layer

**Location**: `internal/application/`

Orchestrates business logic and coordinates between layers.

### Components

#### 1. Application Services

Use cases that orchestrate domain operations.

```go
type TableService struct {
    tableRepo table.TableRepository
}

func (s *TableService) CreateTable(ctx context.Context, req *dto.CreateTableRequest, userID string) (*dto.TableResponse, error) {
    // 1. Validate input
    // 2. Create domain entity
    // 3. Apply business rules
    // 4. Persist via repository
    // 5. Return DTO
}
```

**Responsibilities**:
- Transaction management
- Input validation
- DTO mapping
- Orchestrating multiple domain operations
- NOT business logic (that's in domain layer)

#### 2. DTOs (Data Transfer Objects)

Objects for transferring data between layers.

```go
type CreateTableRequest struct {
    BaseID string `json:"baseId" binding:"required"`
    Name   string `json:"name" binding:"required"`
}

type TableResponse struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    // ... other fields
}
```

**Purpose**:
- Decouple domain models from API contracts
- Validate input
- Shape output

#### 3. Use Case Examples

- `CreateTable`: Create a new table with fields and default view
- `UpdateRecord`: Update record with field validation
- `QueryRecords`: Query records with filtering and sorting

## Infrastructure Layer

**Location**: `internal/infrastructure/`

Implements technical concerns and external dependencies.

### Components

#### 1. Persistence

Database implementations of repository interfaces.

```go
type GormTableRepository struct {
    db *gorm.DB
}

func (r *GormTableRepository) Create(table *table.Table) error {
    model := r.toModel(table)
    return r.db.Create(model).Error
}
```

**Features**:
- ORM mapping (GORM)
- Transaction management
- Query building
- Database-specific optimizations

#### 2. Cache

Redis implementation for caching.

```go
type CacheService struct {
    client *redis.Client
}

func (s *CacheService) Get(ctx context.Context, key string) (string, error)
func (s *CacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
```

#### 3. Storage

MinIO/S3 implementation for file storage.

```go
type StorageService struct {
    client *minio.Client
}

func (s *StorageService) Upload(ctx context.Context, bucket, path string, data io.Reader) error
```

#### 4. Messaging

Redis Pub/Sub for real-time updates.

```go
type PubSubService struct {
    client *redis.Client
}

func (s *PubSubService) Publish(channel string, message interface{}) error
func (s *PubSubService) Subscribe(channel string) <-chan *Message
```

## Interface Layer

**Location**: `internal/interfaces/`

Handles external communication (HTTP, WebSocket, etc.).

### Components

#### 1. HTTP Handlers

Handle HTTP requests and responses.

```go
type TableHandler struct {
    tableService *service.TableService
}

func (h *TableHandler) CreateTable(c *gin.Context) {
    var req dto.CreateTableRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        handleError(c, errors.NewValidationError(err.Error()))
        return
    }
    
    table, err := h.tableService.CreateTable(c.Request.Context(), &req, getUserID(c))
    if err != nil {
        handleError(c, err)
        return
    }
    
    c.JSON(http.StatusCreated, table)
}
```

#### 2. Middleware

Cross-cutting concerns.

```go
type AuthMiddleware struct {
    jwtSecret string
}

func (m *AuthMiddleware) Authenticate() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Validate JWT token
        // Set user context
        c.Next()
    }
}
```

#### 3. WebSocket Handlers

Real-time communication.

```go
type WSHandler struct {
    pubsub *PubSubService
}

func (h *WSHandler) HandleConnection(conn *websocket.Conn) {
    // Handle WebSocket messages
    // Subscribe to channels
    // Broadcast updates
}
```

## Data Flow

### Example: Create Table Request

```
1. HTTP Request
   ↓
2. TableHandler.CreateTable()
   ↓
3. Validate & Bind DTO
   ↓
4. TableService.CreateTable()
   ↓
5. Create Table Entity (Domain)
   ↓
6. Apply Business Rules
   ↓
7. TableRepository.Create()
   ↓
8. GormTableRepository.Create()
   ↓
9. Database INSERT
   ↓
10. Return TableResponse DTO
    ↓
11. HTTP Response
```

### Read Flow

```
HTTP → Handler → Service → Repository → Database
                                ↓
                            Cache (optional)
```

### Write Flow

```
HTTP → Handler → Service → Domain → Repository → Database
                             ↓
                        Event Publish → Redis Pub/Sub → WebSocket
```

## Best Practices

### Domain Layer
- Keep entities focused and cohesive
- Use value objects for concepts without identity
- Apply business rules in entity methods
- Define repository interfaces, not implementations

### Application Layer
- Keep services thin (orchestration only)
- Use DTOs for all external communication
- Handle transactions at this layer
- Map between domain and DTOs

### Infrastructure Layer
- Implement repository interfaces
- Handle database-specific logic
- Manage external service connections
- Don't leak infrastructure details upward

### Interface Layer
- Handle HTTP-specific concerns
- Validate input early
- Return appropriate status codes
- Keep handlers thin

## Testing Strategy

### Unit Tests
- Domain entities and business logic
- Application services with mocked repositories
- Individual components in isolation

### Integration Tests
- Repository implementations with test database
- HTTP handlers with test server
- End-to-end flows

### Example

```go
// Domain test
func TestTable_UpdateName(t *testing.T) {
    table := table.NewTable("id", "baseId", "Original", "db_table", 1.0, "user1")
    table.UpdateName("Updated", "user1")
    assert.Equal(t, "Updated", table.Name)
    assert.Equal(t, 2, table.Version)
}

// Service test with mock
func TestTableService_CreateTable(t *testing.T) {
    mockRepo := new(MockTableRepository)
    service := NewTableService(mockRepo)
    
    mockRepo.On("Create", mock.Anything).Return(nil)
    
    result, err := service.CreateTable(ctx, &req, "user1")
    
    assert.NoError(t, err)
    assert.NotNil(t, result)
    mockRepo.AssertExpectations(t)
}
```

## Migration from NestJS

The DDD architecture provides a clear mapping from the NestJS implementation:

| NestJS | Golang DDD |
|--------|------------|
| `@Injectable()` Services | Application Services |
| Prisma Models | GORM Models (Infrastructure) |
| DTOs with `class-validator` | DTOs with `binding` tags |
| `@Controller()` | HTTP Handlers |
| Repositories | Repository Interfaces + Implementations |
| Domain logic in services | Domain Entities + Services |

---

**For more information, see:**
- [Migration Guide](MIGRATION_GUIDE.md)
- [API Documentation](API.md)
- [Development Guide](DEVELOPMENT.md)
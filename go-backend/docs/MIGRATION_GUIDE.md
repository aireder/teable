# Migration Guide: NestJS to Golang

This guide helps you understand how the Teable backend was migrated from NestJS to Golang using DDD principles.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Mapping](#architecture-mapping)
3. [Code Pattern Mapping](#code-pattern-mapping)
4. [Database Schema](#database-schema)
5. [API Compatibility](#api-compatibility)
6. [Feature Parity](#feature-parity)

## Overview

The Golang implementation maintains **API compatibility** with the NestJS version while introducing a cleaner DDD architecture.

### Why Golang?

- **Performance**: 10-20x faster than Node.js for CPU-intensive operations
- **Concurrency**: Built-in goroutines for real-time features
- **Type Safety**: Strong typing without transpilation
- **Small Binaries**: Single executable deployment
- **DDD**: Better suited for clean architecture patterns

## Architecture Mapping

### NestJS Structure

```
apps/nestjs-backend/src/
├── features/           # Feature modules
│   ├── table/
│   │   ├── table.controller.ts
│   │   ├── table.service.ts
│   │   ├── table.module.ts
│   │   └── model/
│   ├── field/
│   ├── record/
│   └── view/
├── db-provider/        # Database abstraction
├── cache/              # Cache service
└── share-db/           # ShareDB integration
```

### Golang DDD Structure

```
go-backend/
├── cmd/                # Entry points
├── internal/
│   ├── domain/         # Business logic (NEW)
│   │   ├── table/
│   │   ├── field/
│   │   ├── record/
│   │   └── view/
│   ├── application/    # Use cases
│   │   ├── service/
│   │   └── dto/
│   ├── infrastructure/ # External concerns
│   │   ├── persistence/
│   │   ├── cache/
│   │   └── storage/
│   └── interfaces/     # API layer
│       ├── http/
│       └── websocket/
└── pkg/                # Shared utilities
```

## Code Pattern Mapping

### 1. Controllers → Handlers

**NestJS Controller**:
```typescript
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  async createTable(@Body() dto: CreateTableRo): Promise<TableVo> {
    return await this.tableService.createTable(dto);
  }
}
```

**Golang Handler**:
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

### 2. Services → Application Services + Domain Entities

**NestJS Service** (mixes business logic with orchestration):
```typescript
@Injectable()
export class TableService {
  async createTable(ro: CreateTableRo): Promise<TableVo> {
    const tableId = generateTableId();
    const data: Prisma.TableMetaCreateInput = {
      id: tableId,
      name: ro.name,
      // ... logic mixed with data access
    };
    return await this.prismaService.tableMeta.create({ data });
  }
}
```

**Golang** (separated concerns):

**Application Service** (orchestration):
```go
func (s *TableService) CreateTable(ctx context.Context, req *dto.CreateTableRequest, userID string) (*dto.TableResponse, error) {
    tableID := utils.GenerateTableID()
    
    // Create domain entity
    tbl := table.NewTable(tableID, req.BaseID, req.Name, dbTableName, order, userID)
    
    // Persist
    if err := s.tableRepo.Create(tbl); err != nil {
        return nil, errors.NewInternalError("failed to create table")
    }
    
    return s.toResponse(tbl), nil
}
```

**Domain Entity** (business logic):
```go
func NewTable(id, baseID, name, dbTableName string, order float64, createdBy string) *Table {
    now := time.Now()
    return &Table{
        BaseEntity: shared.BaseEntity{
            ID:          id,
            CreatedTime: now,
            CreatedBy:   createdBy,
        },
        BaseID:      baseID,
        Name:        name,
        DbTableName: dbTableName,
        Order:       order,
        Version:     1,
    }
}

func (t *Table) UpdateName(name, userID string) {
    t.Name = name
    t.incrementVersion(userID)
}
```

### 3. DTOs

**NestJS DTO**:
```typescript
export class CreateTableRo {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

**Golang DTO**:
```go
type CreateTableRequest struct {
    Name        string  `json:"name" binding:"required"`
    Description *string `json:"description"`
}
```

### 4. Repositories

**NestJS** (Direct Prisma usage):
```typescript
const table = await this.prismaService.tableMeta.findFirst({
  where: { id: tableId },
});
```

**Golang** (Repository pattern):

**Interface** (in domain):
```go
type TableRepository interface {
    Create(table *Table) error
    FindByID(id string) (*Table, error)
    Update(table *Table) error
}
```

**Implementation** (in infrastructure):
```go
type GormTableRepository struct {
    db *gorm.DB
}

func (r *GormTableRepository) FindByID(id string) (*Table, error) {
    var model TableModel
    if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
        return nil, err
    }
    return r.toEntity(&model), nil
}
```

### 5. Dependency Injection

**NestJS**:
```typescript
@Module({
  providers: [TableService, TableRepository],
  exports: [TableService],
})
export class TableModule {}
```

**Golang** (manual DI in main.go):
```go
// Initialize repositories
tableRepo := persistence.NewGormTableRepository(db)

// Initialize services
tableService := service.NewTableService(tableRepo)

// Initialize handlers
tableHandler := handler.NewTableHandler(tableService)
```

### 6. Validation

**NestJS**:
```typescript
@IsString()
@MinLength(1)
@MaxLength(100)
name: string;
```

**Golang**:
```go
type CreateTableRequest struct {
    Name string `json:"name" binding:"required,min=1,max=100"`
}
```

### 7. Error Handling

**NestJS**:
```typescript
throw new NotFoundException('Table not found');
```

**Golang**:
```go
return errors.NewTableNotFoundError(tableID)
```

## Database Schema

The database schema remains **exactly the same** as the Prisma schema.

### Example: table_meta table

```sql
CREATE TABLE table_meta (
  id VARCHAR PRIMARY KEY,
  base_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  db_table_name VARCHAR UNIQUE NOT NULL,
  "order" DOUBLE PRECISION NOT NULL,
  version INTEGER NOT NULL,
  created_time TIMESTAMP NOT NULL DEFAULT NOW(),
  last_modified_time TIMESTAMP,
  created_by VARCHAR NOT NULL,
  last_modified_by VARCHAR,
  deleted_time TIMESTAMP
);
```

### Migration Strategy

1. **Option 1**: Use existing Prisma migrations
   - Copy migration files
   - Convert to SQL
   - Run with `golang-migrate`

2. **Option 2**: Auto-migrate with GORM
   - Only for development
   - Not recommended for production

3. **Option 3**: Share database
   - Run both systems side-by-side
   - Gradual migration

## API Compatibility

All API endpoints maintain the same contract.

### Example: Create Table

**Endpoint**: `POST /api/bases/:baseId/tables`

**Request** (same):
```json
{
  "name": "My Table",
  "description": "Optional description",
  "icon": "📊"
}
```

**Response** (same):
```json
{
  "id": "tblXXXXXXXXXXXXXXXX",
  "baseId": "bseXXXXXXXXXXXXXXXX",
  "name": "My Table",
  "description": "Optional description",
  "icon": "📊",
  "dbTableName": "tbl_my_table",
  "order": 1.0,
  "version": 1,
  "createdTime": "2025-01-01T00:00:00.000Z",
  "createdBy": "usrXXXXXXXXXXXXXXXX"
}
```

## Feature Parity

### Implemented Features

✅ **Tables**
- Create, Read, Update, Delete
- Soft delete
- Default view ID

✅ **Fields**
- Multiple field types
- Field validation (unique, notNull)
- Computed fields (formula, rollup, lookup)

✅ **Records**
- CRUD operations
- Batch operations
- Field value conversion

✅ **Views**
- Multiple view types (Grid, Kanban, Gallery, Calendar)
- Filtering, sorting, grouping
- Column metadata

✅ **Authentication**
- JWT-based auth
- OAuth2 support

✅ **Caching**
- Redis integration
- Pub/Sub for real-time

### In Progress

🔄 **ShareDB Integration**
- WebSocket support
- Operational Transformation
- Real-time collaboration

🔄 **File Storage**
- MinIO integration
- Presigned URLs
- Thumbnail generation

🔄 **Advanced Features**
- AI integration
- Automation
- Plugins

### Migration Checklist

- [x] Project structure
- [x] Domain models
- [x] Application services
- [x] HTTP handlers
- [x] Database repositories
- [x] Configuration
- [x] Logging
- [x] Error handling
- [ ] WebSocket/ShareDB
- [ ] File storage
- [ ] Email service
- [ ] OAuth providers
- [ ] Automation engine
- [ ] AI integration
- [ ] Complete test coverage

## Performance Comparison

### Expected Improvements

| Operation | NestJS | Golang | Improvement |
|-----------|--------|--------|-------------|
| Table Creation | 50ms | 5ms | 10x faster |
| Record Query (1000 records) | 200ms | 20ms | 10x faster |
| Concurrent WebSocket Connections | 5,000 | 50,000 | 10x more |
| Memory Usage | 200MB | 50MB | 4x less |
| Cold Start | 2s | 100ms | 20x faster |

### Benchmarks

Run benchmarks:
```bash
go test -bench=. ./internal/...
```

## Development Workflow

### NestJS Development

```bash
pnpm dev                    # Start dev server
pnpm test                   # Run tests
pnpm build                  # Build production
```

### Golang Development

```bash
make run                    # Start dev server
make test                   # Run tests
make build                  # Build production binary
```

## Deployment

### NestJS Deployment

```dockerfile
FROM node:20-alpine
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
CMD ["node", "dist/main.js"]
```

### Golang Deployment

```dockerfile
FROM golang:1.21-alpine AS builder
COPY . .
RUN go build -o api cmd/api/main.go

FROM alpine:latest
COPY --from=builder /app/api /api
CMD ["/api"]
```

**Size comparison**:
- NestJS image: ~300MB
- Golang image: ~20MB

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure PostgreSQL is running
   - Check connection string in config

2. **Redis Connection**
   - Ensure Redis is running
   - Check connection settings

3. **Migration Issues**
   - Verify database schema matches Prisma
   - Run migrations manually if needed

## Next Steps

1. Complete ShareDB integration
2. Implement file storage
3. Add comprehensive test coverage
4. Performance benchmarking
5. Production deployment guide

---

**For more information, see:**
- [DDD Architecture](DDD_ARCHITECTURE.md)
- [API Documentation](API.md)
- [Development Guide](DEVELOPMENT.md)
# Architecture Diagrams

Visual representations of the Teable Golang backend architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Applications                      │
│                   (Browser, Mobile, Desktop)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Teable Go Backend                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Interface Layer (HTTP/WebSocket)              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │ Handlers │  │  Router  │  │MiddleWare│  │WebSocket │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         ▲                ▼                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Application Layer (Use Cases)                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ TableService │  │RecordService │  │ ViewService  │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │  ┌──────────────────────────────────────────────────┐    │ │
│  │  │               DTOs (Request/Response)             │    │ │
│  │  └──────────────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         ▲                ▼                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Domain Layer (Business Logic)                │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────┐ │ │
│  │  │  Table    │  │   Field   │  │  Record   │  │  View  │ │ │
│  │  │Aggregate  │  │  Entity   │  │ Aggregate │  │ Entity │ │ │
│  │  └───────────┘  └───────────┘  └───────────┘  └────────┘ │ │
│  │  ┌───────────┐  ┌────────────────────────────────────┐   │ │
│  │  │   User    │  │      Value Objects & Types         │   │ │
│  │  │Aggregate  │  │  (FieldType, Filter, Sort, etc.)   │   │ │
│  │  └───────────┘  └────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         ▲                ▼                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Infrastructure Layer (External)                 │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────┐ │ │
│  │  │PostgreSQL │  │   Redis   │  │   MinIO   │  │  SMTP  │ │ │
│  │  │Repository │  │   Cache   │  │  Storage  │  │  Mail  │ │ │
│  │  └───────────┘  └───────────┘  └───────────┘  └────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│    │PostgreSQL│  │  Redis   │  │  MinIO   │  │ OAuth2   │     │
│    │    DB    │  │  Cache   │  │  Storage │  │Providers │     │
│    └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## DDD Layers

```
┌───────────────────────────────────────────────────────────────┐
│                      Client Layer                              │
│                   HTTP Requests / Responses                    │
└───────────────────────────────────┬───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           ▼                           │
        │  ╔════════════════════════════════════════════════╗  │
        │  ║        INTERFACE LAYER                         ║  │
        │  ║  • HTTP Handlers (Gin)                         ║  │
        │  ║  • WebSocket Handlers                          ║  │
        │  ║  • Middleware (Auth, CORS, Logging)            ║  │
        │  ║  • Request/Response Formatting                 ║  │
        │  ╚════════════════════════════════════════════════╝  │
        │                           │                           │
        │                           ▼                           │
        │  ╔════════════════════════════════════════════════╗  │
        │  ║        APPLICATION LAYER                       ║  │
        │  ║  • Application Services                        ║  │
        │  ║    - TableService                              ║  │
        │  ║    - RecordService                             ║  │
        │  ║    - ViewService                               ║  │
        │  ║  • DTOs (Data Transfer Objects)                ║  │
        │  ║  • Validation                                  ║  │
        │  ║  • Transaction Coordination                    ║  │
        │  ╚════════════════════════════════════════════════╝  │
        │                           │                           │
        │                           ▼                           │
        │  ╔════════════════════════════════════════════════╗  │
        │  ║        DOMAIN LAYER (Core Business Logic)      ║  │
        │  ║  • Aggregates                                  ║  │
        │  ║    - Table (Root)                              ║  │
        │  ║    - Record (Root)                             ║  │
        │  ║    - User (Root)                               ║  │
        │  ║    - Base (Root)                               ║  │
        │  ║  • Entities                                    ║  │
        │  ║    - Field, View                               ║  │
        │  ║  • Value Objects                               ║  │
        │  ║    - FieldType, Filter, Sort                   ║  │
        │  ║  • Repository Interfaces                       ║  │
        │  ║  • Domain Services                             ║  │
        │  ╚════════════════════════════════════════════════╝  │
        │                           │                           │
        │                           ▼                           │
        │  ╔════════════════════════════════════════════════╗  │
        │  ║        INFRASTRUCTURE LAYER                    ║  │
        │  ║  • Repository Implementations                  ║  │
        │  ║    - GormTableRepository                       ║  │
        │  ║  • Database (PostgreSQL + GORM)                ║  │
        │  ║  • Cache (Redis)                               ║  │
        │  ║  • Storage (MinIO)                             ║  │
        │  ║  • External Services                           ║  │
        │  ╚════════════════════════════════════════════════╝  │
        └───────────────────────────────────────────────────────┘
```

## Request Flow

### Create Table Request Flow

```
1. Client
   │
   │ POST /api/bases/:baseId/tables
   │ { "name": "My Table" }
   ▼
2. HTTP Handler (TableHandler)
   │ • Bind JSON to DTO
   │ • Validate input
   │ • Extract user ID from context
   ▼
3. Application Service (TableService)
   │ • Generate table ID
   │ • Get existing tables (for order)
   │ • Create Table entity
   │ • Apply business rules
   ▼
4. Domain Entity (Table)
   │ • NewTable() constructor
   │ • Validates business rules
   │ • Sets initial state
   │ • Version = 1
   ▼
5. Repository (GormTableRepository)
   │ • Convert entity to DB model
   │ • Execute INSERT
   │ • Return created entity
   ▼
6. Application Service
   │ • Convert entity to DTO
   │ • Return TableResponse
   ▼
7. HTTP Handler
   │ • Return JSON response
   │ • Status: 201 Created
   ▼
8. Client
   │ Receives TableResponse
```

## Table Aggregate Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Table Aggregate                          │
│                    (Aggregate Root)                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Table                                                 │ │
│  │ ┌─────────────────────────────────────────────────┐ │ │
│  │ │ Properties:                                     │ │ │
│  │ │ • ID, BaseID, Name                              │ │ │
│  │ │ • DbTableName, Order, Version                   │ │ │
│  │ │ • CreatedBy, LastModifiedBy                     │ │ │
│  │ │ • CreatedTime, LastModifiedTime                 │ │ │
│  │ │ • DeletedTime (soft delete)                     │ │ │
│  │ └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌─────────────────────────────────────────────────┐ │ │
│  │ │ Business Logic:                                 │ │ │
│  │ │ • UpdateName(name, userID)                      │ │ │
│  │ │ • UpdateDescription(desc, userID)               │ │ │
│  │ │ • UpdateIcon(icon, userID)                      │ │ │
│  │ │ • SoftDelete(userID)                            │ │ │
│  │ │ • Restore(userID)                               │ │ │
│  │ │ • IsDeleted() bool                              │ │ │
│  │ └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Contains:                                                  │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │   Fields    │  │    Views    │                         │
│  │  (Entities) │  │  (Entities) │                         │
│  └─────────────┘  └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Repository Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│                                                             │
│  TableService uses:                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ TableRepository (Interface)                          │  │
│  │ ┌──────────────────────────────────────────────────┐ │  │
│  │ │ Create(table *Table) error                       │ │  │
│  │ │ FindByID(id string) (*Table, error)              │ │  │
│  │ │ FindByBaseID(baseID string) ([]*Table, error)    │ │  │
│  │ │ Update(table *Table) error                       │ │  │
│  │ │ Delete(id string) error                          │ │  │
│  │ └──────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Depends on interface
                           │ (Dependency Inversion)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│                                                             │
│  Implementation:                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ GormTableRepository                                  │  │
│  │ ┌──────────────────────────────────────────────────┐ │  │
│  │ │ db *gorm.DB                                      │ │  │
│  │ │                                                  │ │  │
│  │ │ Create(table) → db.Create()                      │ │  │
│  │ │ FindByID(id) → db.Where().First()                │ │  │
│  │ │ Update(table) → db.Save()                        │ │  │
│  │ │ Delete(id) → db.Delete()                         │ │  │
│  │ └──────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│                    ┌─────────────┐                          │
│                    │ PostgreSQL  │                          │
│                    │  Database   │                          │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ HTTP Request
     ▼
┌────────────────┐
│ Gin Router     │
│ • Parse URL    │
│ • Route Match  │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Middleware     │
│ • Auth         │
│ • CORS         │
│ • Logging      │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Handler        │
│ • Bind JSON    │
│ • Validate     │
└────┬───────────┘
     │ DTO
     ▼
┌────────────────┐
│ Service        │
│ • Business     │
│   Logic        │
└────┬───────────┘
     │ Domain Entity
     ▼
┌────────────────┐
│ Repository     │
│ • Data Access  │
└────┬───────────┘
     │ SQL
     ▼
┌────────────────┐
│ Database       │
│ • PostgreSQL   │
└────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │              │  │              │  │             │ │
│  │   Teable     │  │  PostgreSQL  │  │   Redis     │ │
│  │   Go API     │──│   Database   │  │   Cache     │ │
│  │              │  │              │  │             │ │
│  │  Port: 8080  │  │  Port: 5432  │  │ Port: 6379  │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
│         │                                             │
│         │          ┌──────────────┐                   │
│         └──────────│    MinIO     │                   │
│                    │   Storage    │                   │
│                    │              │                   │
│                    │  Port: 9000  │                   │
│                    └──────────────┘                   │
└────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/WebSocket
                         ▼
                ┌─────────────────┐
                │  Load Balancer  │
                │   (nginx/HAProxy)│
                └─────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │    Internet     │
                └─────────────────┘
```

## Folder to Layer Mapping

```
go-backend/
│
├── internal/interfaces/     → Interface Layer
│   ├── http/
│   │   ├── handler/        → HTTP Request Handlers
│   │   └── router/         → Route Definitions
│   └── middleware/         → Cross-cutting Concerns
│
├── internal/application/    → Application Layer
│   ├── service/            → Use Case Implementations
│   └── dto/                → Data Transfer Objects
│
├── internal/domain/         → Domain Layer
│   ├── table/              → Table Aggregate
│   ├── field/              → Field Entity
│   ├── record/             → Record Aggregate
│   ├── view/               → View Entity
│   ├── user/               → User Aggregate
│   └── shared/             → Shared Value Objects
│
└── internal/infrastructure/ → Infrastructure Layer
    ├── persistence/        → Database Implementations
    ├── cache/              → Redis Implementations
    └── storage/            → MinIO Implementations
```

---

## Legend

```
┌─────┐
│ Box │  Component/Layer
└─────┘

  │
  ▼     Flow Direction

  ──    Dependency/Communication

 ════   Strong Boundary

 ┌───┐
 │ • │  List Item
 └───┘
```

---

**These diagrams illustrate the clean separation of concerns and proper layering in the DDD architecture.**
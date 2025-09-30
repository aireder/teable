package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/teableio/teable-go/internal/infrastructure/persistence"
	"github.com/teableio/teable-go/pkg/config"
	"gorm.io/gorm"
)

func main() {
	var action string
	flag.StringVar(&action, "action", "up", "Migration action: up, down, or status")
	flag.Parse()

	// Load configuration
	cfg, err := config.Load("configs/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := persistence.NewDatabase(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer persistence.CloseDatabase(db)

	switch action {
	case "up":
		if err := migrateUp(db); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
		fmt.Println("Migration completed successfully")
	case "down":
		if err := migrateDown(db); err != nil {
			log.Fatalf("Rollback failed: %v", err)
		}
		fmt.Println("Rollback completed successfully")
	case "status":
		printMigrationStatus(db)
	default:
		fmt.Fprintf(os.Stderr, "Unknown action: %s\n", action)
		flag.Usage()
		os.Exit(1)
	}
}

func migrateUp(db *gorm.DB) error {
	// Auto-migrate all models
	// Note: In production, use proper migration tool like golang-migrate
	return db.Exec(`
		-- Create schema if not exists
		CREATE SCHEMA IF NOT EXISTS public;
		
		-- Note: For a real production system, you should use the existing
		-- Prisma migrations from the NestJS project or recreate them.
		-- This is a simplified version for demonstration.
		
		SELECT 1;
	`).Error
}

func migrateDown(db *gorm.DB) error {
	// Implement rollback logic
	return db.Exec(`
		-- Rollback migrations
		SELECT 1;
	`).Error
}

func printMigrationStatus(db *gorm.DB) {
	var count int64
	db.Raw("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'").Scan(&count)
	fmt.Printf("Total tables in public schema: %d\n", count)
}
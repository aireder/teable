package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/teableio/teable-go/internal/application/service"
	"github.com/teableio/teable-go/internal/infrastructure/cache"
	"github.com/teableio/teable-go/internal/infrastructure/persistence"
	"github.com/teableio/teable-go/internal/interfaces/http/handler"
	"github.com/teableio/teable-go/internal/interfaces/http/router"
	"github.com/teableio/teable-go/internal/interfaces/middleware"
	"github.com/teableio/teable-go/pkg/config"
	"github.com/teableio/teable-go/pkg/logger"
)

func main() {
	// Load configuration
	cfg, err := config.Load("configs/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	if err := logger.Init(&cfg.Logger); err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	logger.Info("Logger initialized successfully")

	// Initialize database
	db, err := persistence.NewDatabase(&cfg.Database)
	if err != nil {
		logger.Fatalf("Failed to initialize database: %v", err)
	}
	defer persistence.CloseDatabase(db)
	logger.Info("Database initialized successfully")

	// Initialize Redis
	redisClient, err := cache.NewRedisClient(&cfg.Redis)
	if err != nil {
		logger.Fatalf("Failed to initialize Redis: %v", err)
	}
	defer redisClient.Close()
	logger.Info("Redis initialized successfully")

	// Initialize repositories
	tableRepo := persistence.NewGormTableRepository(db)
	
	// Initialize services
	tableService := service.NewTableService(tableRepo)
	
	// Initialize handlers
	tableHandler := handler.NewTableHandler(tableService)
	
	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(&cfg.JWT)
	
	// Setup Gin
	gin.SetMode(cfg.Server.Mode)
	r := gin.Default()
	
	// Setup routes
	router.Setup(r, tableHandler, authMiddleware)
	
	// Create HTTP server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	srv := &http.Server{
		Addr:           addr,
		Handler:        r,
		ReadTimeout:    cfg.Server.ReadTimeout,
		WriteTimeout:   cfg.Server.WriteTimeout,
		MaxHeaderBytes: 1 << 20,
	}
	
	// Start server in a goroutine
	go func() {
		logger.Infof("Starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Failed to start server: %v", err)
		}
	}()
	
	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	
	logger.Info("Shutting down server...")
	
	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatalf("Server forced to shutdown: %v", err)
	}
	
	logger.Info("Server exited")
}
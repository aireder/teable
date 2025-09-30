package router

import (
	"github.com/gin-gonic/gin"
	"github.com/teableio/teable-go/internal/interfaces/http/handler"
	"github.com/teableio/teable-go/internal/interfaces/middleware"
)

// Setup sets up the HTTP routes
func Setup(
	r *gin.Engine,
	tableHandler *handler.TableHandler,
	authMiddleware *middleware.AuthMiddleware,
) {
	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "teable-go",
		})
	})
	
	// API routes
	api := r.Group("/api")
	{
		// Public routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", func(c *gin.Context) {
				// TODO: Implement login
				c.JSON(200, gin.H{"message": "login endpoint"})
			})
			auth.POST("/register", func(c *gin.Context) {
				// TODO: Implement register
				c.JSON(200, gin.H{"message": "register endpoint"})
			})
		}
		
		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware.Authenticate())
		{
			// Base routes
			bases := protected.Group("/bases/:baseId")
			{
				// Table routes under base
				bases.POST("/tables", tableHandler.CreateTable)
				bases.GET("/tables", tableHandler.GetTablesByBase)
			}
			
			// Table routes
			tables := protected.Group("/tables/:tableId")
			{
				tables.GET("", tableHandler.GetTable)
				tables.PATCH("", tableHandler.UpdateTable)
				tables.DELETE("", tableHandler.DeleteTable)
				
				// Field routes under table
				tables.POST("/fields", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "create field"})
				})
				tables.GET("/fields", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get fields"})
				})
				
				// Record routes under table
				tables.POST("/records", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "create record"})
				})
				tables.GET("/records", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get records"})
				})
				
				// View routes under table
				tables.POST("/views", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "create view"})
				})
				tables.GET("/views", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get views"})
				})
			}
			
			// Field routes
			fields := protected.Group("/fields/:fieldId")
			{
				fields.GET("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get field"})
				})
				fields.PATCH("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "update field"})
				})
				fields.DELETE("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "delete field"})
				})
			}
			
			// Record routes
			records := protected.Group("/records/:recordId")
			{
				records.GET("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get record"})
				})
				records.PATCH("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "update record"})
				})
				records.DELETE("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "delete record"})
				})
			}
			
			// View routes
			views := protected.Group("/views/:viewId")
			{
				views.GET("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "get view"})
				})
				views.PATCH("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "update view"})
				})
				views.DELETE("", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "delete view"})
				})
			}
		}
	}
}
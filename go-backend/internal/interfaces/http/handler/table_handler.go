package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/teableio/teable-go/internal/application/dto"
	"github.com/teableio/teable-go/internal/application/service"
	"github.com/teableio/teable-go/pkg/errors"
)

// TableHandler handles table HTTP requests
type TableHandler struct {
	tableService *service.TableService
}

// NewTableHandler creates a new table handler
func NewTableHandler(tableService *service.TableService) *TableHandler {
	return &TableHandler{
		tableService: tableService,
	}
}

// CreateTable handles POST /api/bases/:baseId/tables
func (h *TableHandler) CreateTable(c *gin.Context) {
	baseID := c.Param("baseId")
	
	var req dto.CreateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		handleError(c, errors.NewValidationError(err.Error()))
		return
	}
	
	req.BaseID = baseID
	userID := getUserID(c)
	
	table, err := h.tableService.CreateTable(c.Request.Context(), &req, userID)
	if err != nil {
		handleError(c, err)
		return
	}
	
	c.JSON(http.StatusCreated, table)
}

// GetTable handles GET /api/tables/:tableId
func (h *TableHandler) GetTable(c *gin.Context) {
	tableID := c.Param("tableId")
	
	table, err := h.tableService.GetTable(c.Request.Context(), tableID)
	if err != nil {
		handleError(c, err)
		return
	}
	
	c.JSON(http.StatusOK, table)
}

// GetTablesByBase handles GET /api/bases/:baseId/tables
func (h *TableHandler) GetTablesByBase(c *gin.Context) {
	baseID := c.Param("baseId")
	
	tables, err := h.tableService.GetTablesByBase(c.Request.Context(), baseID)
	if err != nil {
		handleError(c, err)
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"tables": tables})
}

// UpdateTable handles PATCH /api/tables/:tableId
func (h *TableHandler) UpdateTable(c *gin.Context) {
	tableID := c.Param("tableId")
	
	var req dto.UpdateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		handleError(c, errors.NewValidationError(err.Error()))
		return
	}
	
	userID := getUserID(c)
	
	table, err := h.tableService.UpdateTable(c.Request.Context(), tableID, &req, userID)
	if err != nil {
		handleError(c, err)
		return
	}
	
	c.JSON(http.StatusOK, table)
}

// DeleteTable handles DELETE /api/tables/:tableId
func (h *TableHandler) DeleteTable(c *gin.Context) {
	tableID := c.Param("tableId")
	userID := getUserID(c)
	
	if err := h.tableService.DeleteTable(c.Request.Context(), tableID, userID); err != nil {
		handleError(c, err)
		return
	}
	
	c.Status(http.StatusNoContent)
}

func getUserID(c *gin.Context) string {
	// Extract user ID from context (set by auth middleware)
	if userID, exists := c.Get("userID"); exists {
		return userID.(string)
	}
	return "system" // Fallback
}

func handleError(c *gin.Context, err error) {
	if appErr, ok := err.(*errors.AppError); ok {
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	
	c.JSON(http.StatusInternalServerError, gin.H{
		"code":    "INTERNAL_ERROR",
		"message": err.Error(),
	})
}
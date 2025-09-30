package dto

import "github.com/teableio/teable-go/internal/domain/shared"

// CreateViewRequest represents the request to create a view
type CreateViewRequest struct {
	TableID     string              `json:"tableId" binding:"required"`
	Name        string              `json:"name" binding:"required"`
	Type        shared.ViewType     `json:"type" binding:"required"`
	Description *string             `json:"description"`
	Sort        *shared.Sort        `json:"sort"`
	Filter      *shared.Filter      `json:"filter"`
	Group       *shared.Group       `json:"group"`
	Options     *shared.ViewOptions `json:"options"`
	ColumnMeta  *shared.ColumnMeta  `json:"columnMeta"`
}

// UpdateViewRequest represents the request to update a view
type UpdateViewRequest struct {
	Name        *string             `json:"name"`
	Description *string             `json:"description"`
	Sort        *shared.Sort        `json:"sort"`
	Filter      *shared.Filter      `json:"filter"`
	Group       *shared.Group       `json:"group"`
	Options     *shared.ViewOptions `json:"options"`
}

// ViewResponse represents a view response
type ViewResponse struct {
	ID               string              `json:"id"`
	TableID          string              `json:"tableId"`
	Name             string              `json:"name"`
	Description      *string             `json:"description,omitempty"`
	Type             shared.ViewType     `json:"type"`
	Sort             *shared.Sort        `json:"sort,omitempty"`
	Filter           *shared.Filter      `json:"filter,omitempty"`
	Group            *shared.Group       `json:"group,omitempty"`
	Options          *shared.ViewOptions `json:"options,omitempty"`
	ColumnMeta       shared.ColumnMeta   `json:"columnMeta"`
	Order            float64             `json:"order"`
	Version          int                 `json:"version"`
	IsLocked         bool                `json:"isLocked,omitempty"`
	EnableShare      bool                `json:"enableShare,omitempty"`
	ShareID          *string             `json:"shareId,omitempty"`
	CreatedTime      string              `json:"createdTime"`
	LastModifiedTime *string             `json:"lastModifiedTime,omitempty"`
	CreatedBy        string              `json:"createdBy"`
	LastModifiedBy   *string             `json:"lastModifiedBy,omitempty"`
}
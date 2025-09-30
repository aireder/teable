package dto

// CreateTableRequest represents the request to create a table
type CreateTableRequest struct {
	BaseID      string  `json:"baseId" binding:"required"`
	Name        string  `json:"name" binding:"required"`
	Description *string `json:"description"`
	Icon        *string `json:"icon"`
	DbTableName *string `json:"dbTableName"`
}

// UpdateTableRequest represents the request to update a table
type UpdateTableRequest struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Icon        *string `json:"icon"`
}

// TableResponse represents a table response
type TableResponse struct {
	ID               string  `json:"id"`
	BaseID           string  `json:"baseId"`
	Name             string  `json:"name"`
	Description      *string `json:"description,omitempty"`
	Icon             *string `json:"icon,omitempty"`
	DbTableName      string  `json:"dbTableName"`
	Order            float64 `json:"order"`
	Version          int     `json:"version"`
	DefaultViewID    *string `json:"defaultViewId,omitempty"`
	CreatedTime      string  `json:"createdTime"`
	LastModifiedTime *string `json:"lastModifiedTime,omitempty"`
	CreatedBy        string  `json:"createdBy"`
	LastModifiedBy   *string `json:"lastModifiedBy,omitempty"`
}
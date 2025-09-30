package dto

import "github.com/teableio/teable-go/internal/domain/shared"

// CreateRecordRequest represents the request to create a record
type CreateRecordRequest struct {
	Fields map[string]interface{} `json:"fields" binding:"required"`
}

// CreateRecordsRequest represents the request to create multiple records
type CreateRecordsRequest struct {
	Records []CreateRecordRequest `json:"records" binding:"required,min=1"`
}

// UpdateRecordRequest represents the request to update a record
type UpdateRecordRequest struct {
	Fields map[string]interface{} `json:"fields" binding:"required"`
}

// GetRecordsRequest represents the request to get records
type GetRecordsRequest struct {
	ViewID          *string        `form:"viewId"`
	Skip            int            `form:"skip"`
	Take            int            `form:"take" binding:"max=1000"`
	Filter          *shared.Filter `form:"filter"`
	Sort            *shared.Sort   `form:"sort"`
	GroupBy         *shared.Group  `form:"groupBy"`
	Search          *string        `form:"search"`
	Projection      []string       `form:"projection"`
	FieldKeyType    string         `form:"fieldKeyType"` // id, name
	CellFormat      string         `form:"cellFormat"`   // json, text
	IgnoreViewQuery bool           `form:"ignoreViewQuery"`
}

// RecordResponse represents a record response
type RecordResponse struct {
	ID               string                 `json:"id"`
	Fields           map[string]interface{} `json:"fields"`
	Name             string                 `json:"name"`
	AutoNumber       int                    `json:"autoNumber"`
	CreatedTime      string                 `json:"createdTime"`
	LastModifiedTime *string                `json:"lastModifiedTime,omitempty"`
	CreatedBy        string                 `json:"createdBy"`
	LastModifiedBy   *string                `json:"lastModifiedBy,omitempty"`
}

// RecordsResponse represents multiple records response
type RecordsResponse struct {
	Records []RecordResponse `json:"records"`
	Total   int64            `json:"total,omitempty"`
}
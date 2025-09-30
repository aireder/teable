package dto

import "github.com/teableio/teable-go/internal/domain/shared"

// CreateFieldRequest represents the request to create a field
type CreateFieldRequest struct {
	TableID     string                `json:"tableId" binding:"required"`
	Name        string                `json:"name" binding:"required"`
	Type        shared.FieldType      `json:"type" binding:"required"`
	Description *string               `json:"description"`
	Options     *shared.FieldOptions  `json:"options"`
	NotNull     bool                  `json:"notNull"`
	Unique      bool                  `json:"unique"`
	IsPrimary   bool                  `json:"isPrimary"`
}

// UpdateFieldRequest represents the request to update a field
type UpdateFieldRequest struct {
	Name        *string              `json:"name"`
	Description *string              `json:"description"`
	Options     *shared.FieldOptions `json:"options"`
	NotNull     *bool                `json:"notNull"`
	Unique      *bool                `json:"unique"`
}

// FieldResponse represents a field response
type FieldResponse struct {
	ID                  string                `json:"id"`
	TableID             string                `json:"tableId"`
	Name                string                `json:"name"`
	Description         *string               `json:"description,omitempty"`
	Type                shared.FieldType      `json:"type"`
	DbFieldType         shared.DbFieldType    `json:"dbFieldType"`
	DbFieldName         string                `json:"dbFieldName"`
	CellValueType       shared.CellValueType  `json:"cellValueType"`
	IsMultipleCellValue bool                  `json:"isMultipleCellValue,omitempty"`
	Options             *shared.FieldOptions  `json:"options,omitempty"`
	NotNull             bool                  `json:"notNull,omitempty"`
	Unique              bool                  `json:"unique,omitempty"`
	IsPrimary           bool                  `json:"isPrimary,omitempty"`
	IsComputed          bool                  `json:"isComputed,omitempty"`
	IsLookup            bool                  `json:"isLookup,omitempty"`
	Order               float64               `json:"order"`
	Version             int                   `json:"version"`
	CreatedTime         string                `json:"createdTime"`
	LastModifiedTime    *string               `json:"lastModifiedTime,omitempty"`
	CreatedBy           string                `json:"createdBy"`
	LastModifiedBy      *string               `json:"lastModifiedBy,omitempty"`
}
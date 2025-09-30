package field

import (
	"encoding/json"
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
)

// Field represents a field entity (Part of Table Aggregate)
type Field struct {
	shared.BaseEntity
	TableID             string               `json:"tableId"`
	Name                string               `json:"name"`
	Description         *string              `json:"description,omitempty"`
	Type                shared.FieldType     `json:"type"`
	DbFieldType         shared.DbFieldType   `json:"dbFieldType"`
	DbFieldName         string               `json:"dbFieldName"`
	CellValueType       shared.CellValueType `json:"cellValueType"`
	IsMultipleCellValue bool                 `json:"isMultipleCellValue,omitempty"`
	Options             *shared.FieldOptions `json:"options,omitempty"`
	NotNull             bool                 `json:"notNull,omitempty"`
	Unique              bool                 `json:"unique,omitempty"`
	IsPrimary           bool                 `json:"isPrimary,omitempty"`
	IsComputed          bool                 `json:"isComputed,omitempty"`
	IsLookup            bool                 `json:"isLookup,omitempty"`
	IsPending           bool                 `json:"isPending,omitempty"`
	HasError            bool                 `json:"hasError,omitempty"`
	LookupLinkedFieldID *string              `json:"lookupLinkedFieldId,omitempty"`
	LookupOptions       *shared.LookupOptions `json:"lookupOptions,omitempty"`
	Order               float64              `json:"order"`
	Version             int                  `json:"version"`
	DeletedTime         *time.Time           `json:"deletedTime,omitempty"`
}

// NewField creates a new field
func NewField(
	id, tableID, name, dbFieldName string,
	fieldType shared.FieldType,
	dbFieldType shared.DbFieldType,
	cellValueType shared.CellValueType,
	order float64,
	createdBy string,
) *Field {
	now := time.Now()
	return &Field{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   createdBy,
		},
		TableID:       tableID,
		Name:          name,
		Type:          fieldType,
		DbFieldType:   dbFieldType,
		DbFieldName:   dbFieldName,
		CellValueType: cellValueType,
		Order:         order,
		Version:       1,
	}
}

// UpdateName updates field name
func (f *Field) UpdateName(name, userID string) {
	f.Name = name
	f.incrementVersion(userID)
}

// UpdateOptions updates field options
func (f *Field) UpdateOptions(options *shared.FieldOptions, userID string) {
	f.Options = options
	f.incrementVersion(userID)
}

// UpdateDescription updates field description
func (f *Field) UpdateDescription(description *string, userID string) {
	f.Description = description
	f.incrementVersion(userID)
}

// SetValidation sets field validation rules
func (f *Field) SetValidation(notNull, unique bool, userID string) {
	f.NotNull = notNull
	f.Unique = unique
	f.incrementVersion(userID)
}

// MarkAsError marks field as having an error
func (f *Field) MarkAsError(hasError bool, userID string) {
	f.HasError = hasError
	f.incrementVersion(userID)
}

// SoftDelete marks field as deleted
func (f *Field) SoftDelete(userID string) {
	now := time.Now()
	f.DeletedTime = &now
	f.incrementVersion(userID)
}

// IsDeleted checks if field is soft deleted
func (f *Field) IsDeleted() bool {
	return f.DeletedTime != nil
}

func (f *Field) incrementVersion(userID string) {
	f.Version++
	now := time.Now()
	f.LastModifiedTime = &now
	f.LastModifiedBy = &userID
}

// ConvertCellValue2DBValue converts a cell value to database value
func (f *Field) ConvertCellValue2DBValue(cellValue interface{}) (interface{}, error) {
	if cellValue == nil {
		return nil, nil
	}

	// Handle different field types
	switch f.Type {
	case shared.FieldTypeAttachment, shared.FieldTypeLink, shared.FieldTypeMultipleSelect:
		// Convert to JSON string for storage
		jsonBytes, err := json.Marshal(cellValue)
		if err != nil {
			return nil, err
		}
		return string(jsonBytes), nil
	default:
		return cellValue, nil
	}
}

// ConvertDBValue2CellValue converts a database value to cell value
func (f *Field) ConvertDBValue2CellValue(dbValue interface{}) (interface{}, error) {
	if dbValue == nil {
		return nil, nil
	}

	// Handle JSON fields
	switch f.Type {
	case shared.FieldTypeAttachment:
		var attachments []shared.AttachmentItem
		if err := json.Unmarshal([]byte(dbValue.(string)), &attachments); err != nil {
			return nil, err
		}
		return attachments, nil
	case shared.FieldTypeLink:
		var links []shared.LinkItem
		if err := json.Unmarshal([]byte(dbValue.(string)), &links); err != nil {
			return nil, err
		}
		return links, nil
	case shared.FieldTypeMultipleSelect:
		var values []string
		if err := json.Unmarshal([]byte(dbValue.(string)), &values); err != nil {
			return nil, err
		}
		return values, nil
	default:
		return dbValue, nil
	}
}

// FieldRepository defines the repository interface for fields
type FieldRepository interface {
	// Create creates a new field
	Create(field *Field) error
	
	// FindByID finds a field by ID
	FindByID(id string) (*Field, error)
	
	// FindByTableID finds all fields in a table
	FindByTableID(tableID string) ([]*Field, error)
	
	// Update updates a field
	Update(field *Field) error
	
	// Delete deletes a field
	Delete(id string) error
	
	// BatchCreate creates multiple fields
	BatchCreate(fields []*Field) error
	
	// BatchUpdate updates multiple fields
	BatchUpdate(fields []*Field) error
}
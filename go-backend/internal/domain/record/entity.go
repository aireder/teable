package record

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
)

// Record represents a record entity
type Record struct {
	shared.BaseEntity
	TableID    string                 `json:"tableId"`
	Fields     map[string]interface{} `json:"fields"`
	Name       string                 `json:"name"` // Primary field value
	AutoNumber int                    `json:"autoNumber"`
	Order      map[string]float64     `json:"order,omitempty"` // viewId -> order
	Version    int                    `json:"version"`
}

// NewRecord creates a new record
func NewRecord(
	id, tableID string,
	fields map[string]interface{},
	autoNumber int,
	createdBy string,
) *Record {
	now := time.Now()
	return &Record{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   createdBy,
		},
		TableID:    tableID,
		Fields:     fields,
		AutoNumber: autoNumber,
		Version:    1,
	}
}

// UpdateFields updates record fields
func (r *Record) UpdateFields(fields map[string]interface{}, userID string) {
	for k, v := range fields {
		r.Fields[k] = v
	}
	r.incrementVersion(userID)
}

// UpdateField updates a single field
func (r *Record) UpdateField(fieldID string, value interface{}, userID string) {
	r.Fields[fieldID] = value
	r.incrementVersion(userID)
}

// GetFieldValue gets a field value
func (r *Record) GetFieldValue(fieldID string) (interface{}, bool) {
	value, ok := r.Fields[fieldID]
	return value, ok
}

// SetOrder sets the order for a view
func (r *Record) SetOrder(viewID string, order float64, userID string) {
	if r.Order == nil {
		r.Order = make(map[string]float64)
	}
	r.Order[viewID] = order
	r.incrementVersion(userID)
}

func (r *Record) incrementVersion(userID string) {
	r.Version++
	now := time.Now()
	r.LastModifiedTime = &now
	r.LastModifiedBy = &userID
}

// RecordRepository defines the repository interface for records
type RecordRepository interface {
	// Create creates a new record
	Create(record *Record) error
	
	// FindByID finds a record by ID
	FindByID(tableID, recordID string) (*Record, error)
	
	// FindByTableID finds records by table ID with pagination
	FindByTableID(tableID string, skip, take int) ([]*Record, error)
	
	// Update updates a record
	Update(record *Record) error
	
	// Delete deletes a record
	Delete(tableID, recordID string) error
	
	// BatchCreate creates multiple records
	BatchCreate(records []*Record) error
	
	// BatchDelete deletes multiple records
	BatchDelete(tableID string, recordIDs []string) error
	
	// Count counts records in a table
	Count(tableID string) (int64, error)
	
	// Query queries records with filters and sorting
	Query(tableID string, filter *shared.Filter, sort *shared.Sort, skip, take int) ([]*Record, error)
}
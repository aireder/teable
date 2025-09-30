package table

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
)

// Table represents a table entity (Aggregate Root)
type Table struct {
	shared.BaseEntity
	BaseID       string  `json:"baseId"`
	Name         string  `json:"name"`
	Description  *string `json:"description,omitempty"`
	Icon         *string `json:"icon,omitempty"`
	DbTableName  string  `json:"dbTableName"`
	Order        float64 `json:"order"`
	Version      int     `json:"version"`
	DeletedTime  *time.Time `json:"deletedTime,omitempty"`
	DefaultViewID *string `json:"defaultViewId,omitempty"`
}

// NewTable creates a new table
func NewTable(
	id, baseID, name, dbTableName string,
	order float64,
	createdBy string,
) *Table {
	now := time.Now()
	return &Table{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   createdBy,
		},
		BaseID:      baseID,
		Name:        name,
		DbTableName: dbTableName,
		Order:       order,
		Version:     1,
	}
}

// UpdateName updates table name
func (t *Table) UpdateName(name, userID string) {
	t.Name = name
	t.incrementVersion(userID)
}

// UpdateDescription updates table description
func (t *Table) UpdateDescription(description *string, userID string) {
	t.Description = description
	t.incrementVersion(userID)
}

// UpdateIcon updates table icon
func (t *Table) UpdateIcon(icon *string, userID string) {
	t.Icon = icon
	t.incrementVersion(userID)
}

// SoftDelete marks table as deleted
func (t *Table) SoftDelete(userID string) {
	now := time.Now()
	t.DeletedTime = &now
	t.incrementVersion(userID)
}

// Restore restores a deleted table
func (t *Table) Restore(userID string) {
	t.DeletedTime = nil
	t.incrementVersion(userID)
}

// IsDeleted checks if table is soft deleted
func (t *Table) IsDeleted() bool {
	return t.DeletedTime != nil
}

func (t *Table) incrementVersion(userID string) {
	t.Version++
	now := time.Now()
	t.LastModifiedTime = &now
	t.LastModifiedBy = &userID
}

// TableRepository defines the repository interface for tables
type TableRepository interface {
	// Create creates a new table
	Create(table *Table) error
	
	// FindByID finds a table by ID
	FindByID(id string) (*Table, error)
	
	// FindByBaseID finds all tables in a base
	FindByBaseID(baseID string) ([]*Table, error)
	
	// Update updates a table
	Update(table *Table) error
	
	// Delete deletes a table
	Delete(id string) error
	
	// GetDefaultViewID gets the default view ID for a table
	GetDefaultViewID(tableID string) (string, error)
}
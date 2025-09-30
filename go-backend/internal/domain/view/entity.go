package view

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
)

// View represents a view entity (Part of Table Aggregate)
type View struct {
	shared.BaseEntity
	TableID     string              `json:"tableId"`
	Name        string              `json:"name"`
	Description *string             `json:"description,omitempty"`
	Type        shared.ViewType     `json:"type"`
	Sort        *shared.Sort        `json:"sort,omitempty"`
	Filter      *shared.Filter      `json:"filter,omitempty"`
	Group       *shared.Group       `json:"group,omitempty"`
	Options     *shared.ViewOptions `json:"options,omitempty"`
	ColumnMeta  shared.ColumnMeta   `json:"columnMeta"`
	Order       float64             `json:"order"`
	Version     int                 `json:"version"`
	IsLocked    bool                `json:"isLocked,omitempty"`
	EnableShare bool                `json:"enableShare,omitempty"`
	ShareID     *string             `json:"shareId,omitempty"`
	DeletedTime *time.Time          `json:"deletedTime,omitempty"`
}

// NewView creates a new view
func NewView(
	id, tableID, name string,
	viewType shared.ViewType,
	order float64,
	createdBy string,
) *View {
	now := time.Now()
	return &View{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   createdBy,
		},
		TableID:    tableID,
		Name:       name,
		Type:       viewType,
		Order:      order,
		ColumnMeta: make(shared.ColumnMeta),
		Version:    1,
	}
}

// UpdateName updates view name
func (v *View) UpdateName(name, userID string) {
	v.Name = name
	v.incrementVersion(userID)
}

// UpdateDescription updates view description
func (v *View) UpdateDescription(description *string, userID string) {
	v.Description = description
	v.incrementVersion(userID)
}

// UpdateSort updates view sorting
func (v *View) UpdateSort(sort *shared.Sort, userID string) {
	v.Sort = sort
	v.incrementVersion(userID)
}

// UpdateFilter updates view filter
func (v *View) UpdateFilter(filter *shared.Filter, userID string) {
	v.Filter = filter
	v.incrementVersion(userID)
}

// UpdateGroup updates view grouping
func (v *View) UpdateGroup(group *shared.Group, userID string) {
	v.Group = group
	v.incrementVersion(userID)
}

// UpdateOptions updates view options
func (v *View) UpdateOptions(options *shared.ViewOptions, userID string) {
	v.Options = options
	v.incrementVersion(userID)
}

// UpdateColumnMeta updates column metadata
func (v *View) UpdateColumnMeta(fieldID string, column shared.Column, userID string) {
	v.ColumnMeta[fieldID] = column
	v.incrementVersion(userID)
}

// RemoveColumnMeta removes column metadata
func (v *View) RemoveColumnMeta(fieldID string, userID string) {
	delete(v.ColumnMeta, fieldID)
	v.incrementVersion(userID)
}

// Lock locks the view
func (v *View) Lock(userID string) {
	v.IsLocked = true
	v.incrementVersion(userID)
}

// Unlock unlocks the view
func (v *View) Unlock(userID string) {
	v.IsLocked = false
	v.incrementVersion(userID)
}

// EnableSharing enables view sharing
func (v *View) EnableSharing(shareID string, userID string) {
	v.EnableShare = true
	v.ShareID = &shareID
	v.incrementVersion(userID)
}

// DisableSharing disables view sharing
func (v *View) DisableSharing(userID string) {
	v.EnableShare = false
	v.ShareID = nil
	v.incrementVersion(userID)
}

// SoftDelete marks view as deleted
func (v *View) SoftDelete(userID string) {
	now := time.Now()
	v.DeletedTime = &now
	v.incrementVersion(userID)
}

// Restore restores a deleted view
func (v *View) Restore(userID string) {
	v.DeletedTime = nil
	v.incrementVersion(userID)
}

// IsDeleted checks if view is soft deleted
func (v *View) IsDeleted() bool {
	return v.DeletedTime != nil
}

func (v *View) incrementVersion(userID string) {
	v.Version++
	now := time.Now()
	v.LastModifiedTime = &now
	v.LastModifiedBy = &userID
}

// ViewRepository defines the repository interface for views
type ViewRepository interface {
	// Create creates a new view
	Create(view *View) error
	
	// FindByID finds a view by ID
	FindByID(id string) (*View, error)
	
	// FindByTableID finds all views in a table
	FindByTableID(tableID string) ([]*View, error)
	
	// Update updates a view
	Update(view *View) error
	
	// Delete deletes a view
	Delete(id string) error
	
	// BatchUpdate updates multiple views
	BatchUpdate(views []*View) error
}
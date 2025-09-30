package base

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
)

// Base represents a base entity (Aggregate Root)
type Base struct {
	shared.BaseEntity
	SpaceID     string     `json:"spaceId"`
	Name        string     `json:"name"`
	Icon        *string    `json:"icon,omitempty"`
	Order       float64    `json:"order"`
	DeletedTime *time.Time `json:"deletedTime,omitempty"`
}

// NewBase creates a new base
func NewBase(id, spaceID, name string, order float64, createdBy string) *Base {
	now := time.Now()
	return &Base{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   createdBy,
		},
		SpaceID: spaceID,
		Name:    name,
		Order:   order,
	}
}

// UpdateName updates base name
func (b *Base) UpdateName(name, userID string) {
	b.Name = name
	now := time.Now()
	b.LastModifiedTime = &now
	b.LastModifiedBy = &userID
}

// UpdateIcon updates base icon
func (b *Base) UpdateIcon(icon *string, userID string) {
	b.Icon = icon
	now := time.Now()
	b.LastModifiedTime = &now
	b.LastModifiedBy = &userID
}

// SoftDelete marks base as deleted
func (b *Base) SoftDelete(userID string) {
	now := time.Now()
	b.DeletedTime = &now
	b.LastModifiedTime = &now
	b.LastModifiedBy = &userID
}

// Restore restores a deleted base
func (b *Base) Restore(userID string) {
	b.DeletedTime = nil
	now := time.Now()
	b.LastModifiedTime = &now
	b.LastModifiedBy = &userID
}

// IsDeleted checks if base is soft deleted
func (b *Base) IsDeleted() bool {
	return b.DeletedTime != nil
}

// BaseRepository defines the repository interface for bases
type BaseRepository interface {
	// Create creates a new base
	Create(base *Base) error
	
	// FindByID finds a base by ID
	FindByID(id string) (*Base, error)
	
	// FindBySpaceID finds all bases in a space
	FindBySpaceID(spaceID string) ([]*Base, error)
	
	// Update updates a base
	Update(base *Base) error
	
	// Delete deletes a base
	Delete(id string) error
}
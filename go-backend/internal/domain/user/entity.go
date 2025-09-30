package user

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/shared"
	"golang.org/x/crypto/bcrypt"
)

// User represents a user entity (Aggregate Root)
type User struct {
	shared.BaseEntity
	Name             string     `json:"name"`
	Email            string     `json:"email"`
	Password         string     `json:"-"` // Hidden from JSON
	Avatar           *string    `json:"avatar,omitempty"`
	IsAdmin          bool       `json:"isAdmin,omitempty"`
	IsSystem         bool       `json:"isSystem,omitempty"`
	LastSignTime     *time.Time `json:"lastSignTime,omitempty"`
	DeactivatedTime  *time.Time `json:"deactivatedTime,omitempty"`
	DeletedTime      *time.Time `json:"deletedTime,omitempty"`
}

// NewUser creates a new user
func NewUser(id, name, email, password string) (*User, error) {
	hashedPassword, err := hashPassword(password)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	return &User{
		BaseEntity: shared.BaseEntity{
			ID:          id,
			CreatedTime: now,
			CreatedBy:   id, // Self-created
		},
		Name:     name,
		Email:    email,
		Password: hashedPassword,
	}, nil
}

// UpdateProfile updates user profile
func (u *User) UpdateProfile(name string, avatar *string) {
	u.Name = name
	u.Avatar = avatar
	now := time.Now()
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

// UpdatePassword updates user password
func (u *User) UpdatePassword(newPassword string) error {
	hashedPassword, err := hashPassword(newPassword)
	if err != nil {
		return err
	}
	u.Password = hashedPassword
	now := time.Now()
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
	return nil
}

// VerifyPassword verifies if the provided password is correct
func (u *User) VerifyPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// RecordSignIn records user sign in
func (u *User) RecordSignIn() {
	now := time.Now()
	u.LastSignTime = &now
}

// Deactivate deactivates the user
func (u *User) Deactivate() {
	now := time.Now()
	u.DeactivatedTime = &now
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

// Activate activates the user
func (u *User) Activate() {
	u.DeactivatedTime = nil
	now := time.Now()
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

// IsActive checks if user is active
func (u *User) IsActive() bool {
	return u.DeactivatedTime == nil && u.DeletedTime == nil
}

// SoftDelete marks user as deleted
func (u *User) SoftDelete() {
	now := time.Now()
	u.DeletedTime = &now
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

// IsDeleted checks if user is deleted
func (u *User) IsDeleted() bool {
	return u.DeletedTime != nil
}

// PromoteToAdmin promotes user to admin
func (u *User) PromoteToAdmin() {
	u.IsAdmin = true
	now := time.Now()
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

// DemoteFromAdmin demotes user from admin
func (u *User) DemoteFromAdmin() {
	u.IsAdmin = false
	now := time.Now()
	u.LastModifiedTime = &now
	u.LastModifiedBy = &u.ID
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// UserRepository defines the repository interface for users
type UserRepository interface {
	// Create creates a new user
	Create(user *User) error
	
	// FindByID finds a user by ID
	FindByID(id string) (*User, error)
	
	// FindByEmail finds a user by email
	FindByEmail(email string) (*User, error)
	
	// Update updates a user
	Update(user *User) error
	
	// Delete deletes a user
	Delete(id string) error
	
	// List lists users with pagination
	List(skip, take int) ([]*User, int64, error)
}
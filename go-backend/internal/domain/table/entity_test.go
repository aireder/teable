package table

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestNewTable(t *testing.T) {
	// Arrange
	id := "tbl123"
	baseID := "bse456"
	name := "Test Table"
	dbTableName := "test_table"
	order := 1.0
	userID := "usr789"

	// Act
	table := NewTable(id, baseID, name, dbTableName, order, userID)

	// Assert
	assert.Equal(t, id, table.ID)
	assert.Equal(t, baseID, table.BaseID)
	assert.Equal(t, name, table.Name)
	assert.Equal(t, dbTableName, table.DbTableName)
	assert.Equal(t, order, table.Order)
	assert.Equal(t, 1, table.Version)
	assert.Equal(t, userID, table.CreatedBy)
	assert.NotNil(t, table.CreatedTime)
	assert.Nil(t, table.DeletedTime)
}

func TestTable_UpdateName(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Original Name", "original_table", 1.0, "usr789")
	originalVersion := table.Version
	newName := "Updated Name"
	userID := "usr999"

	// Act
	time.Sleep(1 * time.Millisecond) // Ensure time difference
	table.UpdateName(newName, userID)

	// Assert
	assert.Equal(t, newName, table.Name)
	assert.Equal(t, originalVersion+1, table.Version)
	assert.NotNil(t, table.LastModifiedTime)
	assert.Equal(t, &userID, table.LastModifiedBy)
}

func TestTable_UpdateDescription(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
	description := "New Description"
	userID := "usr999"

	// Act
	table.UpdateDescription(&description, userID)

	// Assert
	assert.Equal(t, &description, table.Description)
	assert.Equal(t, 2, table.Version)
}

func TestTable_UpdateIcon(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
	icon := "📊"
	userID := "usr999"

	// Act
	table.UpdateIcon(&icon, userID)

	// Assert
	assert.Equal(t, &icon, table.Icon)
	assert.Equal(t, 2, table.Version)
}

func TestTable_SoftDelete(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
	userID := "usr999"

	// Act
	table.SoftDelete(userID)

	// Assert
	assert.NotNil(t, table.DeletedTime)
	assert.True(t, table.IsDeleted())
	assert.Equal(t, 2, table.Version)
}

func TestTable_Restore(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
	userID := "usr999"
	table.SoftDelete(userID)
	assert.True(t, table.IsDeleted())

	// Act
	table.Restore(userID)

	// Assert
	assert.Nil(t, table.DeletedTime)
	assert.False(t, table.IsDeleted())
	assert.Equal(t, 3, table.Version)
}

func TestTable_IsDeleted(t *testing.T) {
	tests := []struct {
		name    string
		setup   func() *Table
		want    bool
	}{
		{
			name: "not deleted",
			setup: func() *Table {
				return NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
			},
			want: false,
		},
		{
			name: "deleted",
			setup: func() *Table {
				table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
				table.SoftDelete("usr999")
				return table
			},
			want: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			table := tt.setup()
			assert.Equal(t, tt.want, table.IsDeleted())
		})
	}
}

func TestTable_VersionIncrement(t *testing.T) {
	// Arrange
	table := NewTable("tbl123", "bse456", "Test Table", "test_table", 1.0, "usr789")
	userID := "usr999"

	// Act
	initialVersion := table.Version
	table.UpdateName("New Name", userID)
	table.UpdateDescription(nil, userID)
	table.UpdateIcon(nil, userID)

	// Assert
	expectedVersion := initialVersion + 3
	assert.Equal(t, expectedVersion, table.Version)
}
package service

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/teableio/teable-go/internal/application/dto"
	"github.com/teableio/teable-go/internal/domain/table"
	"github.com/teableio/teable-go/pkg/errors"
)

// MockTableRepository is a mock implementation of TableRepository
type MockTableRepository struct {
	mock.Mock
}

func (m *MockTableRepository) Create(tbl *table.Table) error {
	args := m.Called(tbl)
	return args.Error(0)
}

func (m *MockTableRepository) FindByID(id string) (*table.Table, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*table.Table), args.Error(1)
}

func (m *MockTableRepository) FindByBaseID(baseID string) ([]*table.Table, error) {
	args := m.Called(baseID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*table.Table), args.Error(1)
}

func (m *MockTableRepository) Update(tbl *table.Table) error {
	args := m.Called(tbl)
	return args.Error(0)
}

func (m *MockTableRepository) Delete(id string) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockTableRepository) GetDefaultViewID(tableID string) (string, error) {
	args := m.Called(tableID)
	return args.String(0), args.Error(1)
}

func TestTableService_CreateTable(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	req := &dto.CreateTableRequest{
		BaseID: "bse123",
		Name:   "Test Table",
	}
	userID := "usr789"
	
	mockRepo.On("FindByBaseID", req.BaseID).Return([]*table.Table{}, nil)
	mockRepo.On("Create", mock.AnythingOfType("*table.Table")).Return(nil)
	
	// Act
	result, err := service.CreateTable(context.Background(), req, userID)
	
	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, req.Name, result.Name)
	assert.Equal(t, req.BaseID, result.BaseID)
	mockRepo.AssertExpectations(t)
}

func TestTableService_CreateTable_RepositoryError(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	req := &dto.CreateTableRequest{
		BaseID: "bse123",
		Name:   "Test Table",
	}
	userID := "usr789"
	
	mockRepo.On("FindByBaseID", req.BaseID).Return([]*table.Table{}, nil)
	mockRepo.On("Create", mock.AnythingOfType("*table.Table")).
		Return(errors.NewInternalError("database error"))
	
	// Act
	result, err := service.CreateTable(context.Background(), req, userID)
	
	// Assert
	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestTableService_GetTable(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	tableID := "tbl123"
	expectedTable := table.NewTable(tableID, "bse123", "Test Table", "test_table", 1.0, "usr789")
	
	mockRepo.On("FindByID", tableID).Return(expectedTable, nil)
	mockRepo.On("GetDefaultViewID", tableID).Return("viw123", nil)
	
	// Act
	result, err := service.GetTable(context.Background(), tableID)
	
	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, tableID, result.ID)
	assert.Equal(t, "Test Table", result.Name)
	mockRepo.AssertExpectations(t)
}

func TestTableService_GetTable_NotFound(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	tableID := "tbl123"
	
	mockRepo.On("FindByID", tableID).Return(nil, errors.NewNotFoundError("table"))
	
	// Act
	result, err := service.GetTable(context.Background(), tableID)
	
	// Assert
	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestTableService_UpdateTable(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	tableID := "tbl123"
	existingTable := table.NewTable(tableID, "bse123", "Old Name", "test_table", 1.0, "usr789")
	newName := "New Name"
	req := &dto.UpdateTableRequest{
		Name: &newName,
	}
	userID := "usr999"
	
	mockRepo.On("FindByID", tableID).Return(existingTable, nil)
	mockRepo.On("Update", mock.AnythingOfType("*table.Table")).Return(nil)
	
	// Act
	result, err := service.UpdateTable(context.Background(), tableID, req, userID)
	
	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, newName, result.Name)
	assert.Equal(t, 2, result.Version) // Version should be incremented
	mockRepo.AssertExpectations(t)
}

func TestTableService_DeleteTable(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	tableID := "tbl123"
	existingTable := table.NewTable(tableID, "bse123", "Test Table", "test_table", 1.0, "usr789")
	userID := "usr999"
	
	mockRepo.On("FindByID", tableID).Return(existingTable, nil)
	mockRepo.On("Update", mock.AnythingOfType("*table.Table")).Return(nil)
	
	// Act
	err := service.DeleteTable(context.Background(), tableID, userID)
	
	// Assert
	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
	
	// Verify the table was soft deleted
	mockRepo.AssertCalled(t, "Update", mock.MatchedBy(func(tbl *table.Table) bool {
		return tbl.IsDeleted()
	}))
}

func TestTableService_GetTablesByBase(t *testing.T) {
	// Arrange
	mockRepo := new(MockTableRepository)
	service := NewTableService(mockRepo)
	
	baseID := "bse123"
	tables := []*table.Table{
		table.NewTable("tbl1", baseID, "Table 1", "table_1", 1.0, "usr789"),
		table.NewTable("tbl2", baseID, "Table 2", "table_2", 2.0, "usr789"),
	}
	
	mockRepo.On("FindByBaseID", baseID).Return(tables, nil)
	
	// Act
	result, err := service.GetTablesByBase(context.Background(), baseID)
	
	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result, 2)
	assert.Equal(t, "Table 1", result[0].Name)
	assert.Equal(t, "Table 2", result[1].Name)
	mockRepo.AssertExpectations(t)
}
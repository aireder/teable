package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/teableio/teable-go/internal/application/dto"
	"github.com/teableio/teable-go/internal/domain/table"
	"github.com/teableio/teable-go/pkg/errors"
	"github.com/teableio/teable-go/pkg/utils"
)

// TableService handles table business logic
type TableService struct {
	tableRepo table.TableRepository
}

// NewTableService creates a new table service
func NewTableService(tableRepo table.TableRepository) *TableService {
	return &TableService{
		tableRepo: tableRepo,
	}
}

// CreateTable creates a new table
func (s *TableService) CreateTable(ctx context.Context, req *dto.CreateTableRequest, userID string) (*dto.TableResponse, error) {
	// Generate table ID
	tableID := utils.GenerateTableID()
	
	// Generate db table name
	dbTableName := req.DbTableName
	if dbTableName == nil || *dbTableName == "" {
		name := generateValidDBName(req.Name)
		dbTableName = &name
	}
	
	// Get max order
	tables, err := s.tableRepo.FindByBaseID(req.BaseID)
	if err != nil {
		return nil, errors.NewInternalError("failed to get tables")
	}
	
	order := 1.0
	for _, t := range tables {
		if t.Order >= order {
			order = t.Order + 1
		}
	}
	
	// Create table entity
	tbl := table.NewTable(tableID, req.BaseID, req.Name, *dbTableName, order, userID)
	if req.Description != nil {
		tbl.UpdateDescription(req.Description, userID)
	}
	if req.Icon != nil {
		tbl.UpdateIcon(req.Icon, userID)
	}
	
	// Save to repository
	if err := s.tableRepo.Create(tbl); err != nil {
		return nil, errors.NewInternalError("failed to create table")
	}
	
	return s.toResponse(tbl), nil
}

// GetTable gets a table by ID
func (s *TableService) GetTable(ctx context.Context, tableID string) (*dto.TableResponse, error) {
	tbl, err := s.tableRepo.FindByID(tableID)
	if err != nil {
		return nil, errors.NewTableNotFoundError(tableID)
	}
	
	if tbl.IsDeleted() {
		return nil, errors.NewTableNotFoundError(tableID)
	}
	
	// Get default view ID
	defaultViewID, err := s.tableRepo.GetDefaultViewID(tableID)
	if err == nil {
		tbl.DefaultViewID = &defaultViewID
	}
	
	return s.toResponse(tbl), nil
}

// GetTablesByBase gets all tables in a base
func (s *TableService) GetTablesByBase(ctx context.Context, baseID string) ([]*dto.TableResponse, error) {
	tables, err := s.tableRepo.FindByBaseID(baseID)
	if err != nil {
		return nil, errors.NewInternalError("failed to get tables")
	}
	
	responses := make([]*dto.TableResponse, 0, len(tables))
	for _, tbl := range tables {
		if !tbl.IsDeleted() {
			responses = append(responses, s.toResponse(tbl))
		}
	}
	
	return responses, nil
}

// UpdateTable updates a table
func (s *TableService) UpdateTable(ctx context.Context, tableID string, req *dto.UpdateTableRequest, userID string) (*dto.TableResponse, error) {
	tbl, err := s.tableRepo.FindByID(tableID)
	if err != nil {
		return nil, errors.NewTableNotFoundError(tableID)
	}
	
	if tbl.IsDeleted() {
		return nil, errors.NewTableNotFoundError(tableID)
	}
	
	if req.Name != nil {
		tbl.UpdateName(*req.Name, userID)
	}
	if req.Description != nil {
		tbl.UpdateDescription(req.Description, userID)
	}
	if req.Icon != nil {
		tbl.UpdateIcon(req.Icon, userID)
	}
	
	if err := s.tableRepo.Update(tbl); err != nil {
		return nil, errors.NewInternalError("failed to update table")
	}
	
	return s.toResponse(tbl), nil
}

// DeleteTable deletes a table
func (s *TableService) DeleteTable(ctx context.Context, tableID, userID string) error {
	tbl, err := s.tableRepo.FindByID(tableID)
	if err != nil {
		return errors.NewTableNotFoundError(tableID)
	}
	
	if tbl.IsDeleted() {
		return errors.NewTableNotFoundError(tableID)
	}
	
	tbl.SoftDelete(userID)
	
	if err := s.tableRepo.Update(tbl); err != nil {
		return errors.NewInternalError("failed to delete table")
	}
	
	return nil
}

func (s *TableService) toResponse(tbl *table.Table) *dto.TableResponse {
	resp := &dto.TableResponse{
		ID:            tbl.ID,
		BaseID:        tbl.BaseID,
		Name:          tbl.Name,
		Description:   tbl.Description,
		Icon:          tbl.Icon,
		DbTableName:   tbl.DbTableName,
		Order:         tbl.Order,
		Version:       tbl.Version,
		DefaultViewID: tbl.DefaultViewID,
		CreatedTime:   tbl.CreatedTime.Format("2006-01-02T15:04:05.000Z"),
		CreatedBy:     tbl.CreatedBy,
	}
	
	if tbl.LastModifiedTime != nil {
		t := tbl.LastModifiedTime.Format("2006-01-02T15:04:05.000Z")
		resp.LastModifiedTime = &t
	}
	if tbl.LastModifiedBy != nil {
		resp.LastModifiedBy = tbl.LastModifiedBy
	}
	
	return resp
}

func generateValidDBName(name string) string {
	// Convert to lowercase and replace spaces/special chars with underscore
	name = strings.ToLower(name)
	name = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			return r
		}
		return '_'
	}, name)
	
	// Ensure max length of 40 chars
	if len(name) > 40 {
		name = name[:40]
	}
	
	return fmt.Sprintf("tbl_%s", name)
}
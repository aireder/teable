package service

import (
	"context"

	"github.com/teableio/teable-go/internal/application/dto"
	"github.com/teableio/teable-go/internal/domain/field"
	"github.com/teableio/teable-go/internal/domain/record"
	"github.com/teableio/teable-go/pkg/errors"
	"github.com/teableio/teable-go/pkg/utils"
)

// RecordService handles record business logic
type RecordService struct {
	recordRepo record.RecordRepository
	fieldRepo  field.FieldRepository
}

// NewRecordService creates a new record service
func NewRecordService(recordRepo record.RecordRepository, fieldRepo field.FieldRepository) *RecordService {
	return &RecordService{
		recordRepo: recordRepo,
		fieldRepo:  fieldRepo,
	}
}

// CreateRecord creates a new record
func (s *RecordService) CreateRecord(ctx context.Context, tableID string, req *dto.CreateRecordRequest, userID string) (*dto.RecordResponse, error) {
	// Validate and convert field values
	fields, err := s.validateAndConvertFields(tableID, req.Fields)
	if err != nil {
		return nil, err
	}
	
	// Get next auto number
	count, err := s.recordRepo.Count(tableID)
	if err != nil {
		return nil, errors.NewInternalError("failed to get record count")
	}
	
	// Generate record ID
	recordID := utils.GenerateRecordID()
	
	// Create record entity
	rec := record.NewRecord(recordID, tableID, fields, int(count)+1, userID)
	
	// Save to repository
	if err := s.recordRepo.Create(rec); err != nil {
		return nil, errors.NewInternalError("failed to create record")
	}
	
	return s.toResponse(rec), nil
}

// CreateRecords creates multiple records
func (s *RecordService) CreateRecords(ctx context.Context, tableID string, req *dto.CreateRecordsRequest, userID string) (*dto.RecordsResponse, error) {
	records := make([]*record.Record, 0, len(req.Records))
	
	// Get next auto number
	count, err := s.recordRepo.Count(tableID)
	if err != nil {
		return nil, errors.NewInternalError("failed to get record count")
	}
	
	for i, r := range req.Records {
		// Validate and convert field values
		fields, err := s.validateAndConvertFields(tableID, r.Fields)
		if err != nil {
			return nil, err
		}
		
		recordID := utils.GenerateRecordID()
		rec := record.NewRecord(recordID, tableID, fields, int(count)+i+1, userID)
		records = append(records, rec)
	}
	
	// Batch create
	if err := s.recordRepo.BatchCreate(records); err != nil {
		return nil, errors.NewInternalError("failed to create records")
	}
	
	responses := make([]dto.RecordResponse, len(records))
	for i, rec := range records {
		responses[i] = *s.toResponse(rec)
	}
	
	return &dto.RecordsResponse{
		Records: responses,
		Total:   int64(len(responses)),
	}, nil
}

// GetRecord gets a record by ID
func (s *RecordService) GetRecord(ctx context.Context, tableID, recordID string) (*dto.RecordResponse, error) {
	rec, err := s.recordRepo.FindByID(tableID, recordID)
	if err != nil {
		return nil, errors.NewRecordNotFoundError(recordID)
	}
	
	return s.toResponse(rec), nil
}

// GetRecords gets records with filtering and sorting
func (s *RecordService) GetRecords(ctx context.Context, tableID string, req *dto.GetRecordsRequest) (*dto.RecordsResponse, error) {
	take := req.Take
	if take == 0 {
		take = 100
	}
	if take > 1000 {
		take = 1000
	}
	
	var records []*record.Record
	var err error
	
	if req.Filter != nil || req.Sort != nil {
		records, err = s.recordRepo.Query(tableID, req.Filter, req.Sort, req.Skip, take)
	} else {
		records, err = s.recordRepo.FindByTableID(tableID, req.Skip, take)
	}
	
	if err != nil {
		return nil, errors.NewInternalError("failed to get records")
	}
	
	responses := make([]dto.RecordResponse, len(records))
	for i, rec := range records {
		responses[i] = *s.toResponse(rec)
	}
	
	// Get total count
	total, _ := s.recordRepo.Count(tableID)
	
	return &dto.RecordsResponse{
		Records: responses,
		Total:   total,
	}, nil
}

// UpdateRecord updates a record
func (s *RecordService) UpdateRecord(ctx context.Context, tableID, recordID string, req *dto.UpdateRecordRequest, userID string) (*dto.RecordResponse, error) {
	rec, err := s.recordRepo.FindByID(tableID, recordID)
	if err != nil {
		return nil, errors.NewRecordNotFoundError(recordID)
	}
	
	// Validate and convert field values
	fields, err := s.validateAndConvertFields(tableID, req.Fields)
	if err != nil {
		return nil, err
	}
	
	rec.UpdateFields(fields, userID)
	
	if err := s.recordRepo.Update(rec); err != nil {
		return nil, errors.NewInternalError("failed to update record")
	}
	
	return s.toResponse(rec), nil
}

// DeleteRecord deletes a record
func (s *RecordService) DeleteRecord(ctx context.Context, tableID, recordID, userID string) error {
	_, err := s.recordRepo.FindByID(tableID, recordID)
	if err != nil {
		return errors.NewRecordNotFoundError(recordID)
	}
	
	if err := s.recordRepo.Delete(tableID, recordID); err != nil {
		return errors.NewInternalError("failed to delete record")
	}
	
	return nil
}

// DeleteRecords deletes multiple records
func (s *RecordService) DeleteRecords(ctx context.Context, tableID string, recordIDs []string, userID string) error {
	if err := s.recordRepo.BatchDelete(tableID, recordIDs); err != nil {
		return errors.NewInternalError("failed to delete records")
	}
	
	return nil
}

func (s *RecordService) validateAndConvertFields(tableID string, fields map[string]interface{}) (map[string]interface{}, error) {
	// Get all fields for the table
	tableFields, err := s.fieldRepo.FindByTableID(tableID)
	if err != nil {
		return nil, errors.NewInternalError("failed to get fields")
	}
	
	fieldMap := make(map[string]*field.Field)
	for _, f := range tableFields {
		fieldMap[f.ID] = f
	}
	
	// Validate and convert each field value
	convertedFields := make(map[string]interface{})
	for fieldID, value := range fields {
		f, ok := fieldMap[fieldID]
		if !ok {
			return nil, errors.NewFieldNotFoundError(fieldID)
		}
		
		// Convert cell value to DB value
		dbValue, err := f.ConvertCellValue2DBValue(value)
		if err != nil {
			return nil, errors.NewValidationError("invalid field value")
		}
		
		convertedFields[fieldID] = dbValue
	}
	
	return convertedFields, nil
}

func (s *RecordService) toResponse(rec *record.Record) *dto.RecordResponse {
	resp := &dto.RecordResponse{
		ID:         rec.ID,
		Fields:     rec.Fields,
		Name:       rec.Name,
		AutoNumber: rec.AutoNumber,
		CreatedTime: rec.CreatedTime.Format("2006-01-02T15:04:05.000Z"),
		CreatedBy:  rec.CreatedBy,
	}
	
	if rec.LastModifiedTime != nil {
		t := rec.LastModifiedTime.Format("2006-01-02T15:04:05.000Z")
		resp.LastModifiedTime = &t
	}
	if rec.LastModifiedBy != nil {
		resp.LastModifiedBy = rec.LastModifiedBy
	}
	
	return resp
}
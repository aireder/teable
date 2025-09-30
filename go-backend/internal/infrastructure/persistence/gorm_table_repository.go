package persistence

import (
	"time"

	"github.com/teableio/teable-go/internal/domain/table"
	"gorm.io/gorm"
)

// TableModel represents the database model for tables
type TableModel struct {
	ID               string     `gorm:"column:id;primaryKey"`
	BaseID           string     `gorm:"column:base_id;index"`
	Name             string     `gorm:"column:name"`
	Description      *string    `gorm:"column:description"`
	Icon             *string    `gorm:"column:icon"`
	DbTableName      string     `gorm:"column:db_table_name;uniqueIndex"`
	Order            float64    `gorm:"column:order;index"`
	Version          int        `gorm:"column:version"`
	CreatedTime      time.Time  `gorm:"column:created_time"`
	LastModifiedTime *time.Time `gorm:"column:last_modified_time"`
	CreatedBy        string     `gorm:"column:created_by"`
	LastModifiedBy   *string    `gorm:"column:last_modified_by"`
	DeletedTime      *time.Time `gorm:"column:deleted_time;index"`
}

func (TableModel) TableName() string {
	return "table_meta"
}

// GormTableRepository implements TableRepository using GORM
type GormTableRepository struct {
	db *gorm.DB
}

// NewGormTableRepository creates a new GORM table repository
func NewGormTableRepository(db *gorm.DB) table.TableRepository {
	return &GormTableRepository{db: db}
}

func (r *GormTableRepository) Create(tbl *table.Table) error {
	model := r.toModel(tbl)
	return r.db.Create(model).Error
}

func (r *GormTableRepository) FindByID(id string) (*table.Table, error) {
	var model TableModel
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		return nil, err
	}
	return r.toEntity(&model), nil
}

func (r *GormTableRepository) FindByBaseID(baseID string) ([]*table.Table, error) {
	var models []TableModel
	if err := r.db.Where("base_id = ? AND deleted_time IS NULL", baseID).
		Order("\"order\" ASC").
		Find(&models).Error; err != nil {
		return nil, err
	}
	
	tables := make([]*table.Table, len(models))
	for i, model := range models {
		tables[i] = r.toEntity(&model)
	}
	return tables, nil
}

func (r *GormTableRepository) Update(tbl *table.Table) error {
	model := r.toModel(tbl)
	return r.db.Save(model).Error
}

func (r *GormTableRepository) Delete(id string) error {
	return r.db.Delete(&TableModel{}, "id = ?", id).Error
}

func (r *GormTableRepository) GetDefaultViewID(tableID string) (string, error) {
	var viewID string
	err := r.db.Table("view").
		Select("id").
		Where("table_id = ? AND deleted_time IS NULL", tableID).
		Order("\"order\" ASC").
		Limit(1).
		Scan(&viewID).Error
	return viewID, err
}

func (r *GormTableRepository) toModel(tbl *table.Table) *TableModel {
	return &TableModel{
		ID:               tbl.ID,
		BaseID:           tbl.BaseID,
		Name:             tbl.Name,
		Description:      tbl.Description,
		Icon:             tbl.Icon,
		DbTableName:      tbl.DbTableName,
		Order:            tbl.Order,
		Version:          tbl.Version,
		CreatedTime:      tbl.CreatedTime,
		LastModifiedTime: tbl.LastModifiedTime,
		CreatedBy:        tbl.CreatedBy,
		LastModifiedBy:   tbl.LastModifiedBy,
		DeletedTime:      tbl.DeletedTime,
	}
}

func (r *GormTableRepository) toEntity(model *TableModel) *table.Table {
	tbl := &table.Table{
		BaseID:      model.BaseID,
		Name:        model.Name,
		Description: model.Description,
		Icon:        model.Icon,
		DbTableName: model.DbTableName,
		Order:       model.Order,
		Version:     model.Version,
		DeletedTime: model.DeletedTime,
	}
	tbl.ID = model.ID
	tbl.CreatedTime = model.CreatedTime
	tbl.LastModifiedTime = model.LastModifiedTime
	tbl.CreatedBy = model.CreatedBy
	tbl.LastModifiedBy = model.LastModifiedBy
	return tbl
}
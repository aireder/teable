package shared

import (
	"encoding/json"
	"time"
)

// FieldType represents the type of a field
type FieldType string

const (
	FieldTypeSingleLineText  FieldType = "singleLineText"
	FieldTypeLongText        FieldType = "longText"
	FieldTypeNumber          FieldType = "number"
	FieldTypeSingleSelect    FieldType = "singleSelect"
	FieldTypeMultipleSelect  FieldType = "multipleSelect"
	FieldTypeDate            FieldType = "date"
	FieldTypeCheckbox        FieldType = "checkbox"
	FieldTypeUser            FieldType = "user"
	FieldTypeAttachment      FieldType = "attachment"
	FieldTypeLink            FieldType = "link"
	FieldTypeFormula         FieldType = "formula"
	FieldTypeRollup          FieldType = "rollup"
	FieldTypeLookup          FieldType = "lookup"
	FieldTypeCreatedTime     FieldType = "createdTime"
	FieldTypeLastModifiedTime FieldType = "lastModifiedTime"
	FieldTypeCreatedBy       FieldType = "createdBy"
	FieldTypeLastModifiedBy  FieldType = "lastModifiedBy"
	FieldTypeAutoNumber      FieldType = "autoNumber"
	FieldTypeButton          FieldType = "button"
	FieldTypeRating          FieldType = "rating"
)

// ViewType represents the type of view
type ViewType string

const (
	ViewTypeGrid     ViewType = "grid"
	ViewTypeKanban   ViewType = "kanban"
	ViewTypeGallery  ViewType = "gallery"
	ViewTypeCalendar ViewType = "calendar"
	ViewTypeForm     ViewType = "form"
)

// DbFieldType represents database field type
type DbFieldType string

const (
	DbFieldTypeText    DbFieldType = "text"
	DbFieldTypeNumber  DbFieldType = "real"
	DbFieldTypeBoolean DbFieldType = "boolean"
	DbFieldTypeDate    DbFieldType = "date"
	DbFieldTypeJSON    DbFieldType = "json"
)

// CellValueType represents the cell value type
type CellValueType string

const (
	CellValueTypeString   CellValueType = "string"
	CellValueTypeNumber   CellValueType = "number"
	CellValueTypeBoolean  CellValueType = "boolean"
	CellValueTypeDateTime CellValueType = "dateTime"
)

// Filter represents a query filter
type Filter struct {
	Conjunction string       `json:"conjunction"`
	FilterSet   []FilterItem `json:"filterSet"`
}

// FilterItem represents a single filter item
type FilterItem struct {
	FieldID  string      `json:"fieldId,omitempty"`
	Operator string      `json:"operator,omitempty"`
	Value    interface{} `json:"value,omitempty"`
	FilterSet []FilterItem `json:"filterSet,omitempty"`
	Conjunction string    `json:"conjunction,omitempty"`
}

// Sort represents sorting configuration
type Sort struct {
	SortObjs   []SortItem `json:"sortObjs"`
	ManualSort bool       `json:"manualSort"`
}

// SortItem represents a single sort item
type SortItem struct {
	FieldID string `json:"fieldId"`
	Order   string `json:"order"` // asc, desc
}

// Group represents grouping configuration
type Group []GroupItem

// GroupItem represents a single group item
type GroupItem struct {
	FieldID string `json:"fieldId"`
	Order   string `json:"order"`
}

// ColumnMeta represents column metadata
type ColumnMeta map[string]Column

// Column represents column configuration
type Column struct {
	Order   int  `json:"order"`
	Width   int  `json:"width,omitempty"`
	Hidden  bool `json:"hidden,omitempty"`
	Visible bool `json:"visible,omitempty"`
}

// FieldOptions represents field configuration options
type FieldOptions struct {
	Choices          []SelectChoice      `json:"choices,omitempty"`
	Precision        int                 `json:"precision,omitempty"`
	Formatting       *DateFormatting     `json:"formatting,omitempty"`
	DefaultValue     interface{}         `json:"defaultValue,omitempty"`
	ForeignTableID   string              `json:"foreignTableId,omitempty"`
	Relationship     string              `json:"relationship,omitempty"`
	FkHostTableName  string              `json:"fkHostTableName,omitempty"`
	SelfKeyName      string              `json:"selfKeyName,omitempty"`
	ForeignKeyName   string              `json:"foreignKeyName,omitempty"`
	SymmetricFieldID string              `json:"symmetricFieldId,omitempty"`
}

// SelectChoice represents a select option
type SelectChoice struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

// DateFormatting represents date formatting options
type DateFormatting struct {
	Date     string `json:"date"`
	Time     string `json:"time"`
	TimeZone string `json:"timeZone"`
}

// LookupOptions represents lookup field options
type LookupOptions struct {
	LinkFieldID      string `json:"linkFieldId"`
	LookupFieldID    string `json:"lookupFieldId"`
	RelationshipType string `json:"relationshipType"`
}

// ViewOptions represents view configuration options (polymorphic)
type ViewOptions struct {
	StackFieldID     string `json:"stackFieldId,omitempty"`     // Kanban
	CoverFieldID     string `json:"coverFieldId,omitempty"`     // Gallery
	IsCardCover      bool   `json:"isCardCover,omitempty"`      // Gallery
	StartDateFieldID string `json:"startDateFieldId,omitempty"` // Calendar
	EndDateFieldID   string `json:"endDateFieldId,omitempty"`   // Calendar
}

// CellValue represents a polymorphic cell value
type CellValue interface{}

// AttachmentItem represents an attachment
type AttachmentItem struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	Token          string    `json:"token"`
	Size           int64     `json:"size"`
	Mimetype       string    `json:"mimetype"`
	Width          int       `json:"width,omitempty"`
	Height         int       `json:"height,omitempty"`
	Path           string    `json:"path"`
	PresignedURL   string    `json:"presignedUrl,omitempty"`
	SmThumbnailURL string    `json:"smThumbnailUrl,omitempty"`
	LgThumbnailURL string    `json:"lgThumbnailUrl,omitempty"`
}

// LinkItem represents a link to another record
type LinkItem struct {
	ID    string `json:"id"`
	Title string `json:"title,omitempty"`
}

// Snapshot represents a versioned snapshot
type Snapshot struct {
	ID      string      `json:"id"`
	Version int         `json:"v"`
	Type    string      `json:"type"`
	Data    interface{} `json:"data"`
}

// BaseEntity provides common fields for all entities
type BaseEntity struct {
	ID               string     `json:"id"`
	CreatedTime      time.Time  `json:"createdTime"`
	LastModifiedTime *time.Time `json:"lastModifiedTime,omitempty"`
	CreatedBy        string     `json:"createdBy"`
	LastModifiedBy   *string    `json:"lastModifiedBy,omitempty"`
}

// MarshalJSON custom marshaling for proper time format
func (b *BaseEntity) MarshalJSON() ([]byte, error) {
	type Alias BaseEntity
	return json.Marshal(&struct {
		CreatedTime      string  `json:"createdTime"`
		LastModifiedTime *string `json:"lastModifiedTime,omitempty"`
		*Alias
	}{
		CreatedTime:      b.CreatedTime.Format(time.RFC3339),
		LastModifiedTime: formatTimePtr(b.LastModifiedTime),
		Alias:            (*Alias)(b),
	})
}

func formatTimePtr(t *time.Time) *string {
	if t == nil {
		return nil
	}
	s := t.Format(time.RFC3339)
	return &s
}
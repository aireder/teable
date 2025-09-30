package errors

import (
	"fmt"
	"net/http"
)

// AppError represents an application error
type AppError struct {
	Code       string                 `json:"code"`
	Message    string                 `json:"message"`
	HTTPStatus int                    `json:"-"`
	Details    map[string]interface{} `json:"details,omitempty"`
}

func (e *AppError) Error() string {
	return e.Message
}

// Error codes
const (
	// General errors
	ErrCodeInternal        = "INTERNAL_ERROR"
	ErrCodeNotFound        = "NOT_FOUND"
	ErrCodeBadRequest      = "BAD_REQUEST"
	ErrCodeUnauthorized    = "UNAUTHORIZED"
	ErrCodeForbidden       = "FORBIDDEN"
	ErrCodeConflict        = "CONFLICT"
	ErrCodeValidation      = "VALIDATION_ERROR"
	
	// Domain specific errors
	ErrCodeTableNotFound   = "TABLE_NOT_FOUND"
	ErrCodeFieldNotFound   = "FIELD_NOT_FOUND"
	ErrCodeRecordNotFound  = "RECORD_NOT_FOUND"
	ErrCodeViewNotFound    = "VIEW_NOT_FOUND"
	ErrCodeBaseNotFound    = "BASE_NOT_FOUND"
	ErrCodeUserNotFound    = "USER_NOT_FOUND"
	
	// Business logic errors
	ErrCodeDuplicateName   = "DUPLICATE_NAME"
	ErrCodeInvalidFieldType = "INVALID_FIELD_TYPE"
	ErrCodeFieldValueDuplicate = "FIELD_VALUE_DUPLICATE"
	ErrCodeFieldValueNotNull = "FIELD_VALUE_NOT_NULL"
	ErrCodeMaxRowLimitExceeded = "MAX_ROW_LIMIT_EXCEEDED"
)

// NewAppError creates a new application error
func NewAppError(code, message string, httpStatus int) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		HTTPStatus: httpStatus,
	}
}

// WithDetails adds details to the error
func (e *AppError) WithDetails(details map[string]interface{}) *AppError {
	e.Details = details
	return e
}

// Common errors
func NewNotFoundError(resource string) *AppError {
	return NewAppError(
		ErrCodeNotFound,
		fmt.Sprintf("%s not found", resource),
		http.StatusNotFound,
	)
}

func NewBadRequestError(message string) *AppError {
	return NewAppError(
		ErrCodeBadRequest,
		message,
		http.StatusBadRequest,
	)
}

func NewValidationError(message string) *AppError {
	return NewAppError(
		ErrCodeValidation,
		message,
		http.StatusBadRequest,
	)
}

func NewUnauthorizedError(message string) *AppError {
	return NewAppError(
		ErrCodeUnauthorized,
		message,
		http.StatusUnauthorized,
	)
}

func NewForbiddenError(message string) *AppError {
	return NewAppError(
		ErrCodeForbidden,
		message,
		http.StatusForbidden,
	)
}

func NewConflictError(message string) *AppError {
	return NewAppError(
		ErrCodeConflict,
		message,
		http.StatusConflict,
	)
}

func NewInternalError(message string) *AppError {
	return NewAppError(
		ErrCodeInternal,
		message,
		http.StatusInternalServerError,
	)
}

// Domain specific errors
func NewTableNotFoundError(tableID string) *AppError {
	return NewAppError(
		ErrCodeTableNotFound,
		fmt.Sprintf("Table %s not found", tableID),
		http.StatusNotFound,
	)
}

func NewFieldNotFoundError(fieldID string) *AppError {
	return NewAppError(
		ErrCodeFieldNotFound,
		fmt.Sprintf("Field %s not found", fieldID),
		http.StatusNotFound,
	)
}

func NewRecordNotFoundError(recordID string) *AppError {
	return NewAppError(
		ErrCodeRecordNotFound,
		fmt.Sprintf("Record %s not found", recordID),
		http.StatusNotFound,
	)
}

func NewViewNotFoundError(viewID string) *AppError {
	return NewAppError(
		ErrCodeViewNotFound,
		fmt.Sprintf("View %s not found", viewID),
		http.StatusNotFound,
	)
}
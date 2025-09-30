package utils

import (
	"strings"

	"github.com/google/uuid"
)

// ID prefixes
const (
	PrefixBase   = "bse"
	PrefixTable  = "tbl"
	PrefixField  = "fld"
	PrefixRecord = "rec"
	PrefixView   = "viw"
	PrefixUser   = "usr"
	PrefixSpace  = "spc"
)

// GenerateID generates a new ID with the given prefix
func GenerateID(prefix string) string {
	id := uuid.New().String()
	id = strings.ReplaceAll(id, "-", "")
	return prefix + id[:16]
}

// GenerateBaseID generates a base ID
func GenerateBaseID() string {
	return GenerateID(PrefixBase)
}

// GenerateTableID generates a table ID
func GenerateTableID() string {
	return GenerateID(PrefixTable)
}

// GenerateFieldID generates a field ID
func GenerateFieldID() string {
	return GenerateID(PrefixField)
}

// GenerateRecordID generates a record ID
func GenerateRecordID() string {
	return GenerateID(PrefixRecord)
}

// GenerateViewID generates a view ID
func GenerateViewID() string {
	return GenerateID(PrefixView)
}

// GenerateUserID generates a user ID
func GenerateUserID() string {
	return GenerateID(PrefixUser)
}

// GenerateSpaceID generates a space ID
func GenerateSpaceID() string {
	return GenerateID(PrefixSpace)
}

// ValidateIDPrefix validates if an ID has the correct prefix
func ValidateIDPrefix(id, expectedPrefix string) bool {
	return strings.HasPrefix(id, expectedPrefix)
}

// GetIDPrefix extracts the prefix from an ID
func GetIDPrefix(id string) string {
	if len(id) >= 3 {
		return id[:3]
	}
	return ""
}
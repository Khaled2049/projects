package models

import "gorm.io/gorm"

type Code struct {
	gorm.Model
	Title       string
	ProblemDesc string
	CreatedBy   uint
	CodeBody    string
	CodeComment string
}

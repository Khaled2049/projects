package main

import (
	"github.com/khaled2049/problem-tracker/initializers"
	"github.com/khaled2049/problem-tracker/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
}

func main() {
	initializers.DB.AutoMigrate(&models.Code{})
}

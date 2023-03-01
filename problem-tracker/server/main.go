package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/khaled2049/problem-tracker/controllers"
	"github.com/khaled2049/problem-tracker/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	// Create Code
	r.POST("/code", controllers.CodesCreate)

	// View all Code
	r.GET("/code", controllers.CodesView)

	// View single Code by ID
	r.GET("/code/:id", controllers.CodesSingle)

	// Updates Code by ID
	r.PUT("/code/:id", controllers.CodesUpdate)

	// Deletes Code by ID
	r.DELETE("/code/:id", controllers.CodesDelete)

	r.Run() // listen and serve on 0.0.0.0:8080
}

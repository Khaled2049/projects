package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/khaled2049/problem-tracker/initializers"
	"github.com/khaled2049/problem-tracker/models"
)

func CodesCreate(c *gin.Context) {

	var body struct {
		Title       string
		ProblemDesc string
		CreatedBy   uint
		CodeBody    string
		CodeComment string
	}

	c.Bind(&body)

	code := models.Code{
		Title:       body.Title,
		ProblemDesc: body.ProblemDesc,
		CreatedBy:   body.CreatedBy,
		CodeBody:    body.CodeBody,
		CodeComment: body.CodeComment,
	}

	result := initializers.DB.Create(&code)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"code": code,
	})
}

func CodesView(c *gin.Context) {
	var codes []models.Code
	initializers.DB.Find(&codes)

	c.JSON(200, gin.H{
		"codes": codes,
	})
}

func CodesSingle(c *gin.Context) {

	id := c.Param("id")

	var code models.Code
	initializers.DB.First(&code, id)

	c.JSON(200, gin.H{
		"codes": code,
	})
}

func CodesUpdate(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Title       string
		ProblemDesc string
		CreatedBy   uint
		CodeBody    string
		CodeComment string
	}

	c.Bind(&body)

	var code models.Code
	initializers.DB.First(&code, id)

	initializers.DB.Model(&code).Updates(models.Code{
		Title:       body.Title,
		ProblemDesc: body.ProblemDesc,
		CreatedBy:   body.CreatedBy,
		CodeBody:    body.CodeBody,
		CodeComment: body.CodeComment,
	})

	c.JSON(200, gin.H{
		"codes": code,
	})
}

func CodesDelete(c *gin.Context) {
	id := c.Param("id")

	initializers.DB.Delete(&models.Code{}, id)

	c.Status(200)
}

package main

import (
	"database/sql"
	"log"

	"github.com/khaled2049/backend/cmd/api"
	"github.com/khaled2049/backend/db"
)

func initDb(db *sql.DB) {
	err := db.Ping()

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database")
}

func main() {

	db, err := db.NewDatabase()
	if err != nil {
		log.Fatal(err)
	}
	initDb(db)

	server := api.NewAPIServer(":8080", db)
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}

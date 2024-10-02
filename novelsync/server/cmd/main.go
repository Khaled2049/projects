package main

import (
	"log"

	"github.com/khaled2049/backend/cmd/api"
)

func main() {
	server := api.NewAPIServer(":8080", nil)
	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}

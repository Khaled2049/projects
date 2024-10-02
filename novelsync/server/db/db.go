package db

import (
	"database/sql"

	"github.com/khaled2049/backend/config"
	_ "github.com/lib/pq"
)

func NewDatabase() (*sql.DB, error) {

	db, err := sql.Open("postgres", config.Env.Conn)
	if err != nil {
		return nil, err
	}

	return db, nil
}

package config

import (
	"os"
)

type Config struct {
	Conn string
}

func NewConfig() *Config {
	return &Config{
		Conn: getEnv("DB_CONN", "postgresql://postgres:asdf@localhost:5434/novelsync?sslmode=disable"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// Singleton instance of Config
var Env = NewConfig()

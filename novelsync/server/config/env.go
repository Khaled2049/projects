package config

import (
	"os"
	"strconv"
)

type Config struct {
	Conn                   string
	JWTExpiartionInSeconds int64
	JWTSecret              string
}

func NewConfig() *Config {
	return &Config{
		Conn:                   getEnv("DB_CONN", "postgresql://postgres:asdf@localhost:5434/novelsync?sslmode=disable"),
		JWTExpiartionInSeconds: getEnvAsInt("JWT_EXPIRATION_IN_SECONDS", 3600*24*7),
		JWTSecret:              getEnv("JWT_SECRET", "secret"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		if i, err := strconv.ParseInt(value, 10, 64); err == nil {
			return i
		}
	}
	return fallback
}

// Singleton instance of Config
var Env = NewConfig()

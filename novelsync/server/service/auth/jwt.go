package auth

import (
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/khaled2049/backend/config"
)

func CreateJWT(secret []byte, useId int) (string, error) {
	expiration := time.Second * time.Duration(config.Env.JWTExpiartionInSeconds)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId":    strconv.Itoa(useId),
		"expiredAt": time.Now().Add(expiration).Unix(),
	})

	tokenString, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

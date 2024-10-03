package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func ParseJSON(r *http.Request, v any) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}

	return json.NewDecoder(r.Body).Decode(v)
}

func WriteJson(w http.ResponseWriter, status int, p any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(p)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	WriteJson(w, status, map[string]string{
		"error": err.Error(),
	})
}

var Validate = validator.New()

package user

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/khaled2049/backend/types"
)

func TestUserServiceHandlers(t *testing.T) {
	userStore := &mockUserStore{}
	handler := NewHandler(userStore)

	t.Run("Should Fail if User payload is invalid", func(t *testing.T) {
		payload := types.RegisterUserPayload{
			FirstName: "Khaled",
			LastName:  "Mohamed",
			Email:     "",
			Password:  "password",
		}

		marshalled, _ := json.Marshal(payload)

		req, err := http.NewRequest("POST", "/user", bytes.NewBuffer(marshalled))

		if err != nil {
			t.Fatal(err)
		}

		rec := httptest.NewRecorder()
		router := mux.NewRouter()
		router.HandleFunc("/user", handler.createUser).Methods("POST")

		router.ServeHTTP(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, rec.Code)
		}

	})

	t.Run("Should correctly register a user", func(t *testing.T) {
		payload := types.RegisterUserPayload{
			FirstName: "Khaled",
			LastName:  "Mohamed",
			Email:     "asdf@asdf.com",
			Password:  "password",
		}

		marshalled, _ := json.Marshal(payload)

		req, err := http.NewRequest("POST", "/user", bytes.NewBuffer(marshalled))
		if err != nil {
			t.Fatal(err)
		}

		rec := httptest.NewRecorder()
		router := mux.NewRouter()
		router.HandleFunc("/user", handler.createUser).Methods("POST")

		router.ServeHTTP(rec, req)

		if rec.Code != http.StatusCreated {
			t.Errorf("Expected status code %d, got %d", http.StatusCreated, rec.Code)
		}
	})
}

type mockUserStore struct {
}

func (m *mockUserStore) GetUserByEmail(email string) (*types.User, error) {
	return nil, fmt.Errorf("User not found")
}

func (m *mockUserStore) GetUserByID(id int) (*types.User, error) {
	return nil, nil
}

func (m *mockUserStore) CreateUser(types.User) error {
	return nil
}

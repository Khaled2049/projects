package user

import (
	"database/sql"
	"fmt"

	"github.com/khaled2049/backend/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	query := `
        SELECT id, first_name, last_name, email, password, created_at 
        FROM users 
        WHERE email = $1
    `

	var user types.User
	err := s.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found with email: %s", email)
		}
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	return &user, nil
}

func (s *Store) CreateUser(user types.User) error {
	return nil
}

func (s *Store) GetUserByID(id int) (*types.User, error) {
	return nil, nil
}

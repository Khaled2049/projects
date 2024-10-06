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

	fmt.Println("email", email)
	rows, err := s.db.Query("SELECT * FROM users WHERE email = $1", email)
	if err != nil {
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowsIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func (s *Store) CreateUser(user types.User) error {
	_, err := s.db.Exec(`INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)`,
		user.FirstName, user.LastName, user.Email, user.Password)

	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil

}

func (s *Store) GetUserByID(id int) (*types.User, error) {
	query := `
		SELECT id, firstName, lastName, email, password, created_at 
		FROM users 
		WHERE id = $1
	`

	var user types.User
	err := s.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found with id: %d", id)
		}
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	return &user, nil
}

func scanRowsIntoUser(rows *sql.Rows) (*types.User, error) {
	user := new(types.User)

	err := rows.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

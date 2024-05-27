package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq" // Import PostgreSQL driver
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "4y7sV96vA9wv46VR"
	dbname   = "novelsync"
)

// Struct to represent a user
type User struct {
	ID       int
	Email    string
	Password string

}

// Function to add a new user to the users table
func addUser(db *sql.DB, user User) (int, error) {
	// SQL statement for inserting a new user
	query := `
		INSERT INTO users (email, password)
		VALUES ($1, $2)
		RETURNING id;
	`

	var userID int
	err := db.QueryRow(query, user.Email, user.Password).Scan(&userID)
	if err != nil {
		return 0, err
	}

	return userID, nil
}

// getUsersHandler is a handler function for the /users route
func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	// Construct the connection string
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	// Open a connection to PostgreSQL
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		log.Printf("Error connecting to the database: %v", err)
		return
	}
	defer db.Close()

	// Check if the database connection is successful
	err = db.Ping()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		log.Printf("Error pinging database: %v", err)
		return
	}

	// Query to select all users
	query := "SELECT id, email FROM users"

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		log.Printf("Error querying users: %v", err)
		return
	}
	defer rows.Close()

	// Slice to hold the users
	var users []User

	// Iterate through query results and populate users slice
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			log.Printf("Error scanning user row: %v", err)
			return
		}
		users = append(users, user)
	}

	// Check for errors during row iteration
	if err := rows.Err(); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		log.Printf("Error iterating user rows: %v", err)
		return
	}

	// Marshal users slice to JSON
	usersJSON, err := json.Marshal(users)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		log.Printf("Error marshaling users to JSON: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Replace with the origin of your Svelte app
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	// Write JSON response with users data
	w.Write(usersJSON)
}

func main() {

	// Register getUsersHandler as the handler function for /users route
	http.HandleFunc("/users", getUsersHandler)

	// Start the HTTP server
	log.Println("Server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
	// connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	// // Open a connection to PostgreSQL
	// db, err := sql.Open("postgres", connStr)
	// if err != nil {
	// 	log.Fatal("Error connecting to the database: ", err)
	// }
	// defer db.Close()

	// // Check if the database connection is successful
	// err = db.Ping()
	// if err != nil {
	// 	log.Fatal("Error pinging database: ", err)
	// }

	// // Define the user to add
	// newUser := User{
	// 	Email:    "john.doe@example.com",
	// 	Password: "password123",
	// }

	// // Call the addUser function to insert the new user
	// _, err = addUser(db, newUser)
	// if err != nil {
	// 	log.Fatal("Error adding user: ", err)
	// }


	// // Query to select all rows from the users table
	// query := "SELECT id, email FROM users"

	// // Execute the query
	// rows, err := db.Query(query)
	// if err != nil {
	// 	log.Fatal("Error executing query: ", err)
	// }
	// defer rows.Close()

	// // Iterate through the query results and print each row
	// fmt.Println("Users:")
	// for rows.Next() {
	// 	var id int
	// 	var email string
	// 	if err := rows.Scan(&id, &email); err != nil {
	// 		log.Fatal("Error scanning row: ", err)
	// 	}
	// 	fmt.Printf("ID: %d, Email: %s\n", id, email)
	// }

	// if err := rows.Err(); err != nil {
	// 	log.Fatal("Error iterating rows: ", err)
	// }
}

package types

type RegisterUserPayload struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=3,max=130"`
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type User struct {
	ID        int    `json:"id"`
	FirstName string `json:"firstName"` // Keep as camelCase
	LastName  string `json:"lastName"`  // Keep as camelCase
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt string `json:"createdAt"` // Keep as camelCase
}

type Book struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	PublishedAt string `json:"publishedAt"`
	CreatedAt   string `json:"createdAt"`
}

type BookStore interface {
	GetBooks() ([]Book, error)
	GetBookByID(id int) (*Book, error)
	CreateBook(Book) error
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(User) error
}

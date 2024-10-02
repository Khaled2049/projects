package user

import (
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(route *mux.Router) {
	route.HandleFunc("/login", h.login).Methods("POST")
	route.HandleFunc("/register", h.register).Methods("POST")
	route.HandleFunc("/user", h.createUser).Methods("POST")
	route.HandleFunc("/user/{id}", h.getUser).Methods("GET")
	route.HandleFunc("/user/{id}", h.updateUser).Methods("PUT")
	route.HandleFunc("/user/{id}", h.deleteUser).Methods("DELETE")
}

func (h *Handler) register(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) login(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) createUser(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) getUser(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) updateUser(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) deleteUser(w http.ResponseWriter, r *http.Request) {
}

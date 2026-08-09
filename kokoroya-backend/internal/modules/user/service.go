package user

// Service defines business logic operations for the user domain.
// TODO: define methods, e.g. GetByID(id string) (*User, error)
type Service interface {
}

type service struct {
	repo Repository
}

// NewService creates a new user Service.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

package user

// Repository defines data access operations for the user domain.
// TODO: define methods, e.g. FindByID(id string) (*User, error)
type Repository interface {
}

type repository struct {
	// TODO: db *sql.DB / *gorm.DB
}

// NewRepository creates a new user Repository.
func NewRepository() Repository {
	return &repository{}
}

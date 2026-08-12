package user

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
)

// User is a row in the users table.
type User struct {
	ID           int64
	Name         string
	Email        string
	PasswordHash string
	Role         string
	Phone        *string
	IsActive     bool
	Permissions  []string
	RateWeekday  *float64
	RateWeekend  *float64
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Filter struct {
	ID    *int64
	Email *string
}

type Repository interface {
	FindBy(ctx context.Context, filter Filter) (*User, error)
	Create(ctx context.Context, u *User) error
	SetPermissions(ctx context.Context, id int64, permissions []string) error
	List(ctx context.Context) ([]*User, error)
}

type repository struct {
	db *sql.DB
}

// NewRepository creates a new user Repository.
func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

const userColumns = `id, name, email, password_hash, role, phone, is_active, permissions, rate_weekday, rate_weekend, created_at, updated_at`

func scanUser(row *sql.Row) (*User, error) {
	var u User
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Phone, &u.IsActive, pq.Array(&u.Permissions), &u.RateWeekday, &u.RateWeekend, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// FindBy looks up a user by whichever field is set on filter (ID takes
// precedence if both are somehow set).
func (r *repository) FindBy(ctx context.Context, filter Filter) (*User, error) {
	switch {
	case filter.ID != nil:
		row := r.db.QueryRowContext(ctx, `select `+userColumns+` from users where id = $1`, *filter.ID)
		return scanUser(row)
	case filter.Email != nil:
		row := r.db.QueryRowContext(ctx, `select `+userColumns+` from users where email = $1`, *filter.Email)
		return scanUser(row)
	default:
		return nil, errors.New("user.FindBy: no filter field set")
	}
}

func (r *repository) Create(ctx context.Context, u *User) error {
	return r.db.QueryRowContext(ctx, `
		insert into users (name, email, password_hash, role, phone, is_active, permissions, rate_weekday, rate_weekend)
		values ($1, $2, $3, $4, $5, true, $6, $7, $8)
		returning id, created_at, updated_at
	`, u.Name, u.Email, u.PasswordHash, u.Role, u.Phone, pq.Array(u.Permissions), u.RateWeekday, u.RateWeekend,
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
}

func (r *repository) SetPermissions(ctx context.Context, id int64, permissions []string) error {
	_, err := r.db.ExecContext(ctx, `update users set permissions = $1, updated_at = now() where id = $2`, pq.Array(permissions), id)
	return err
}

func (r *repository) List(ctx context.Context) ([]*User, error) {
	rows, err := r.db.QueryContext(ctx, `select `+userColumns+` from users order by id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Phone, &u.IsActive, pq.Array(&u.Permissions), &u.RateWeekday, &u.RateWeekend, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, &u)
	}
	return users, rows.Err()
}

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
	TFN          *string
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
	Create(ctx context.Context, u *User, branchIDs []int64) error
	SetPermissions(ctx context.Context, id int64, permissions []string) error
	SetBranches(ctx context.Context, userID int64, branchIDs []int64) error
	List(ctx context.Context) ([]*User, error)
}

type repository struct {
	db *sql.DB
}

// NewRepository creates a new user Repository.
func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

const userColumns = `id, name, email, password_hash, role, phone, tfn, is_active, permissions, rate_weekday, rate_weekend, created_at, updated_at`

func scanUser(row *sql.Row) (*User, error) {
	var u User
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Phone, &u.TFN, &u.IsActive, pq.Array(&u.Permissions), &u.RateWeekday, &u.RateWeekend, &u.CreatedAt, &u.UpdatedAt)
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

func (r *repository) Create(ctx context.Context, u *User, branchIDs []int64) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := tx.QueryRowContext(ctx, `
		insert into users (name, email, password_hash, role, phone, tfn, is_active, permissions, rate_weekday, rate_weekend)
		values ($1, $2, $3, $4, $5, $6, true, $7, $8, $9)
		returning id, created_at, updated_at
	`, u.Name, u.Email, u.PasswordHash, u.Role, u.Phone, u.TFN, pq.Array(u.Permissions), u.RateWeekday, u.RateWeekend,
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return err
	}

	if err := insertUserBranches(ctx, tx, u.ID, branchIDs); err != nil {
		return err
	}

	return tx.Commit()
}

func (r *repository) SetPermissions(ctx context.Context, id int64, permissions []string) error {
	_, err := r.db.ExecContext(ctx, `update users set permissions = $1, updated_at = now() where id = $2`, pq.Array(permissions), id)
	return err
}

func (r *repository) SetBranches(ctx context.Context, userID int64, branchIDs []int64) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `delete from user_branches where user_id = $1`, userID); err != nil {
		return err
	}

	if err := insertUserBranches(ctx, tx, userID, branchIDs); err != nil {
		return err
	}

	return tx.Commit()
}

func insertUserBranches(ctx context.Context, tx *sql.Tx, userID int64, branchIDs []int64) error {
	for _, branchID := range branchIDs {
		if _, err := tx.ExecContext(ctx, `insert into user_branches (user_id, branch_id) values ($1, $2)`, userID, branchID); err != nil {
			return err
		}
	}
	return nil
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
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Phone, &u.TFN, &u.IsActive, pq.Array(&u.Permissions), &u.RateWeekday, &u.RateWeekend, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, &u)
	}
	return users, rows.Err()
}

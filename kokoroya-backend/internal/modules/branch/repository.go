package branch

import (
	"context"
	"database/sql"
	"time"
)

type Branch struct {
	ID        int64
	Name      string
	IsActive  bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Repository interface {
	List(ctx context.Context) ([]*Branch, error)
	ListForUser(ctx context.Context, userID int64) ([]*Branch, error)
	Create(ctx context.Context, b *Branch) error
	Update(ctx context.Context, id int64, name *string, isActive *bool) (*Branch, error)
	HasAccess(ctx context.Context, userID, branchID int64) (bool, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

const branchColumns = `id, name, is_active, created_at, updated_at`

func scanBranches(rows *sql.Rows) ([]*Branch, error) {
	defer rows.Close()

	var branches []*Branch
	for rows.Next() {
		var b Branch
		if err := rows.Scan(&b.ID, &b.Name, &b.IsActive, &b.CreatedAt, &b.UpdatedAt); err != nil {
			return nil, err
		}
		branches = append(branches, &b)
	}
	return branches, rows.Err()
}

func (r *repository) List(ctx context.Context) ([]*Branch, error) {
	rows, err := r.db.QueryContext(ctx, `select `+branchColumns+` from branches order by id`)
	if err != nil {
		return nil, err
	}
	return scanBranches(rows)
}

func (r *repository) ListForUser(ctx context.Context, userID int64) ([]*Branch, error) {
	rows, err := r.db.QueryContext(ctx, `
		select b.id, b.name, b.is_active, b.created_at, b.updated_at
		from branches b
		join user_branches ub on ub.branch_id = b.id
		where ub.user_id = $1
		order by b.id
	`, userID)
	if err != nil {
		return nil, err
	}
	return scanBranches(rows)
}

func (r *repository) Create(ctx context.Context, b *Branch) error {
	return r.db.QueryRowContext(ctx, `
		insert into branches (name) values ($1)
		returning id, is_active, created_at, updated_at
	`, b.Name).Scan(&b.ID, &b.IsActive, &b.CreatedAt, &b.UpdatedAt)
}

func (r *repository) Update(ctx context.Context, id int64, name *string, isActive *bool) (*Branch, error) {
	if name != nil {
		if _, err := r.db.ExecContext(ctx, `update branches set name = $1, updated_at = now() where id = $2`, *name, id); err != nil {
			return nil, err
		}
	}
	if isActive != nil {
		if _, err := r.db.ExecContext(ctx, `update branches set is_active = $1, updated_at = now() where id = $2`, *isActive, id); err != nil {
			return nil, err
		}
	}

	row := r.db.QueryRowContext(ctx, `select `+branchColumns+` from branches where id = $1`, id)
	var b Branch
	if err := row.Scan(&b.ID, &b.Name, &b.IsActive, &b.CreatedAt, &b.UpdatedAt); err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *repository) HasAccess(ctx context.Context, userID, branchID int64) (bool, error) {
	var exists bool
	err := r.db.QueryRowContext(ctx, `
		select exists(select 1 from user_branches where user_id = $1 and branch_id = $2)
	`, userID, branchID).Scan(&exists)
	return exists, err
}

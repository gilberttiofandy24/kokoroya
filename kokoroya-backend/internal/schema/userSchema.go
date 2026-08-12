package schema

type CreateUserRequest struct {
	Name        string   `json:"name" binding:"required"`
	Email       string   `json:"email" binding:"required,email"`
	Password    string   `json:"password" binding:"required,min=8"`
	Role        string   `json:"role" binding:"required"`
	Phone       string   `json:"phone"`
	TFN         string   `json:"tfn"`
	Permissions []string `json:"permissions"`
	BranchIDs   []int64  `json:"branch_ids"`
}

type SetPermissionsRequest struct {
	Permissions []string `json:"permissions" binding:"required"`
}

type SetBranchesRequest struct {
	BranchIDs []int64 `json:"branch_ids" binding:"required"`
}

type MeResponse struct {
	ID          int64    `json:"id"`
	Name        string   `json:"name"`
	Email       string   `json:"email"`
	Role        string   `json:"role"`
	Permissions []string `json:"permissions"`
}

package schema

type CreateUserRequest struct {
	Name        string   `json:"name" binding:"required"`
	Email       string   `json:"email" binding:"required,email"`
	Password    string   `json:"password" binding:"required,min=8"`
	Role        string   `json:"role" binding:"required"`
	Permissions []string `json:"permissions"`
}

type SetPermissionsRequest struct {
	Permissions []string `json:"permissions" binding:"required"`
}

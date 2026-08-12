package user

import (
	"errors"

	"github.com/gin-gonic/gin"

	"kokoroya-backend/internal/response"
	"kokoroya-backend/internal/schema"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{service: service}
}

func (ctrl *Controller) Login(c *gin.Context) {
	var req schema.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Err(c, 400, err.Error())
		return
	}

	token, expiresAt, role, err := ctrl.service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			response.Err(c, 401, err.Error())
			return
		}
		response.Err(c, 500, "internal server error")
		return
	}

	data := schema.LoginResponse{
		AccessToken: token,
		ExpiresAt:   expiresAt.Unix(),
		Role:        role,
	}

	response.OK(c, 200, data)
}

func (ctrl *Controller) Logout(c *gin.Context) {
	jti := c.GetString("jti")
	if err := ctrl.service.Logout(c.Request.Context(), jti); err != nil {
		response.Err(c, 500, "internal server error")
		return
	}
	response.NoContent(c)
}

func (ctrl *Controller) CreateUser(c *gin.Context) {
	var req schema.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Err(c, 400, err.Error())
		return
	}

	u, err := ctrl.service.CreateUser(c.Request.Context(), req.Name, req.Email, req.Password, req.Role, req.Permissions)
	if err != nil {
		response.Err(c, 500, "internal server error")
		return
	}

	response.OK(c, 201, gin.H{"id": u.ID, "name": u.Name, "email": u.Email, "role": u.Role, "permissions": u.Permissions})
}

func (ctrl *Controller) SetPermissions(c *gin.Context) {
	id, err := parseIDParam(c)
	if err != nil {
		response.Err(c, 400, "invalid id")
		return
	}

	var req schema.SetPermissionsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Err(c, 400, err.Error())
		return
	}

	if err := ctrl.service.SetPermissions(c.Request.Context(), id, req.Permissions); err != nil {
		response.Err(c, 500, "internal server error")
		return
	}
	response.NoContent(c)
}

func (ctrl *Controller) List(c *gin.Context) {
	users, err := ctrl.service.List(c.Request.Context())
	if err != nil {
		response.Err(c, 500, "internal server error")
		return
	}
	response.OK(c, 200, users)
}

package user

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"kokoroya-backend/internal/middleware"
)

func parseIDParam(c *gin.Context) (int64, error) {
	return strconv.ParseInt(c.Param("id"), 10, 64)
}

func RegisterRoutes(rg *gin.RouterGroup, controller *Controller, authMW gin.HandlerFunc) {
	auth := rg.Group("/auth")
	auth.POST("/login", controller.Login)
	auth.POST("/logout", authMW, controller.Logout)

	users := rg.Group("/users", authMW, middleware.RequireRole(middleware.RoleOwner))
	users.GET("", controller.List)
	users.POST("", controller.CreateUser)
	users.PATCH("/:id/permissions", controller.SetPermissions)
}

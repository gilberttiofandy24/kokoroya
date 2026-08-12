package branch

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"kokoroya-backend/internal/middleware"
)

func parseIDParam(c *gin.Context) (int64, error) {
	return strconv.ParseInt(c.Param("id"), 10, 64)
}

func RegisterRoutes(rg *gin.RouterGroup, controller *Controller, authMW gin.HandlerFunc) {
	rg.GET("/me/branches", authMW, controller.ListMine)

	branches := rg.Group("/branches", authMW, middleware.RequireRole(middleware.RoleOwner))
	branches.GET("", controller.List)
	branches.POST("", controller.Create)
	branches.PATCH("/:id", controller.Update)
}

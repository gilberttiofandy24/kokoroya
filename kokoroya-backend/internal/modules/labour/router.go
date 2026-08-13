package labour

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup, controller *Controller, authMW, requireBranch, requirePerm gin.HandlerFunc) {
	labour := rg.Group("/labour", authMW, requireBranch, requirePerm)
	labour.GET("/report", controller.GetWeeklyReport)
	labour.PUT("/hour-entry", controller.UpsertHourEntry)
	labour.PUT("/rate", controller.UpsertWeeklyRate)
}

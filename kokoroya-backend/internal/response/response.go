// Package response gives every handler one consistent JSON envelope, so
// callers can always expect {"success", "data"} or {"success", "error"}
// instead of each handler inventing its own shape.
package response

import "github.com/gin-gonic/gin"

// OK writes a success envelope with the given status code and payload.
func OK(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"success": true, "data": data})
}

// Err writes an error envelope with the given status code and message.
func Err(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"success": false, "error": message})
}

// NoContent writes a success envelope with no body (204).
func NoContent(c *gin.Context) {
	c.Status(204)
}

// AbortErr writes an error envelope and stops the middleware chain, for use
// in middleware that must reject a request before it reaches a handler.
func AbortErr(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, gin.H{"success": false, "error": message})
}

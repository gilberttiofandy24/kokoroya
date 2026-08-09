package user

// Controller handles HTTP requests for the user domain.
// TODO: define handler methods, e.g. GetByID(c *gin.Context)
type Controller struct {
	service Service
}

// NewController creates a new user Controller.
func NewController(service Service) *Controller {
	return &Controller{service: service}
}

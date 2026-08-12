package router

import (
	"context"
	"database/sql"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"

	"kokoroya-backend/config"
	"kokoroya-backend/internal/jwtauth"
	"kokoroya-backend/internal/middleware"
	"kokoroya-backend/internal/modules/user"
	"kokoroya-backend/internal/session"
)

func New(db *sql.DB, rdb *redis.Client, cfg *config.Config, log *logrus.Logger) *gin.Engine {
	engine := gin.New()
	engine.Use(middleware.Logger(log), middleware.Recovery(log), middleware.CORS())
	api := engine.Group("/v1")

	userRepo := user.NewRepository(db)
	jwtManager := jwtauth.NewManager(cfg.JWT.Secret, time.Duration(cfg.JWT.AccessTTLMin)*time.Minute)
	sessionManager := session.NewManager(rdb)
	userService := user.NewService(userRepo, jwtManager, sessionManager, log)
	userController := user.NewController(userService)
	authMW := middleware.RequireAuth(jwtManager, sessionManager)
	user.RegisterRoutes(api, userController, authMW)

	return engine
}

func permissionLookup(repo user.Repository) middleware.PermissionLookup {
	return func(ctx context.Context, userID int64) ([]string, error) {
		u, err := repo.FindBy(ctx, user.Filter{ID: &userID})
		if err != nil {
			return nil, err
		}
		return u.Permissions, nil
	}
}

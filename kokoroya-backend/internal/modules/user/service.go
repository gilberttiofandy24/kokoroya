package user

import (
	"context"
	"errors"
	"time"

	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"

	"kokoroya-backend/internal/jwtauth"
	"kokoroya-backend/internal/session"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type Service interface {
	Login(ctx context.Context, email, password string) (token string, expiresAt time.Time, role string, err error)
	Logout(ctx context.Context, jti string) error
	CreateUser(ctx context.Context, name, email, password, role string, permissions []string) (*User, error)
	SetPermissions(ctx context.Context, userID int64, permissions []string) error
	List(ctx context.Context) ([]*User, error)
}

type service struct {
	repo           Repository
	jwtManager     *jwtauth.Manager
	sessionManager *session.Manager
	log            *logrus.Logger
}

func NewService(repo Repository, jwtManager *jwtauth.Manager, sessionManager *session.Manager, log *logrus.Logger) Service {
	return &service{repo: repo, jwtManager: jwtManager, sessionManager: sessionManager, log: log}
}

func (s *service) Login(ctx context.Context, email, password string) (string, time.Time, string, error) {
	u, err := s.repo.FindBy(ctx, Filter{Email: &email})
	if err != nil {
		s.log.WithError(err).WithField("email", email).Warn("user.Login: FindBy failed")
		return "", time.Time{}, "", ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		s.log.WithField("email", email).Warn("user.Login: wrong password")
		return "", time.Time{}, "", ErrInvalidCredentials
	}

	token, jti, expiresAt, err := s.jwtManager.Generate(u.ID, u.Role)
	if err != nil {
		s.log.WithError(err).WithField("user_id", u.ID).Error("user.Login: jwt generate failed")
		return "", time.Time{}, "", err
	}

	if err := s.sessionManager.Create(ctx, u.ID, jti, time.Until(expiresAt)); err != nil {
		s.log.WithError(err).WithField("user_id", u.ID).Error("user.Login: session create failed")
		return "", time.Time{}, "", err
	}

	return token, expiresAt, u.Role, nil
}

func (s *service) Logout(ctx context.Context, jti string) error {
	if err := s.sessionManager.Revoke(ctx, jti); err != nil {
		s.log.WithError(err).WithField("jti", jti).Error("user.Logout: session revoke failed")
		return err
	}
	return nil
}

func (s *service) CreateUser(ctx context.Context, name, email, password, role string, permissions []string) (*User, error) {
	existing, err := s.repo.FindBy(ctx, Filter{Email: &email})
	if err == nil && existing != nil {
		s.log.WithField("email", email).Warn("user.CreateUser: email already exists")
		return nil, errors.New("email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		s.log.WithError(err).Error("user.CreateUser: bcrypt hash failed")
		return nil, err
	}

	u := &User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Role:         role,
		Permissions:  permissions,
	}
	if err := s.repo.Create(ctx, u); err != nil {
		s.log.WithError(err).WithField("email", email).Error("user.CreateUser: repo create failed")
		return nil, err
	}
	return u, nil
}

func (s *service) SetPermissions(ctx context.Context, userID int64, permissions []string) error {
	if err := s.repo.SetPermissions(ctx, userID, permissions); err != nil {
		s.log.WithError(err).WithField("user_id", userID).Error("user.SetPermissions: repo update failed")
		return err
	}
	return nil
}

func (s *service) List(ctx context.Context) ([]*User, error) {
	users, err := s.repo.List(ctx)
	if err != nil {
		s.log.WithError(err).Error("user.List: repo query failed")
		return nil, err
	}
	return users, nil
}

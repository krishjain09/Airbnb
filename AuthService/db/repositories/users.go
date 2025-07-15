package db

import (
	"fmt"
)

type UserRepository interface {
	Create() error
}

type UserRepositoryImpl struct {
	// db *sql.DB
}

func NewUserRepsoitory() UserRepository {
	return &UserRepositoryImpl{
		// db: db
	}
}

func (u *UserRepositoryImpl) Create() error {
	fmt.Println("Create user in UserRepository")
	return nil
}

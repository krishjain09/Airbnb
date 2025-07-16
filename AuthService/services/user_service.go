package services

import (
	env "AuthService/config/env"
	db "AuthService/db/repositories"
	"AuthService/utils"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	GetUserById() error
	Create() error
	LoginUser() (string, error)
}

type UserServiceImpl struct {
	userRepository db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepository,
	}
}

func (u *UserServiceImpl) GetUserById() error {
	fmt.Println("Fetching User in UserService")
	u.userRepository.GetById()
	return nil
}

func (u *UserServiceImpl) Create() error {
	fmt.Println("Creating User in UserService")
	username := "test@user"
	email := "email@users"
	password := "password123"
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		fmt.Println("Error in hashing password", err)
		return err
	}
	u.userRepository.Create(username, email, hashedPassword)
	return nil
}

func (u *UserServiceImpl) LoginUser() (string, error) {

	email := "email@users"
	password := "password123"

	// Step 1. Make a repository call to get the user by email
	user, err := u.userRepository.GetUserByEmail(email)

	if err != nil {
		fmt.Println("Error fetching user by email:", err)
		return "", err
	}

	// Step 2. If user exists, or not. If not exists, return error
	if user == nil {
		fmt.Println("No user found with the given email")
		return "", fmt.Errorf("no user found with email: %s", email)
	}

	// Step 3. If user exists, check the password using utils.CheckPasswordHash
	isPasswordValid := utils.CheckPasswordHash(password, user.Password)

	if !isPasswordValid {
		fmt.Println("Password does not match")
		return "", nil
	}

	// Step 4. If password matches, print a JWT token, else return error saying password does not match
	payload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	tokenString, err := token.SignedString([]byte(env.GetString("JWT_SECRET", "TOKEN")))

	if err != nil {
		fmt.Println("Error signing token:", err)
		return "", err
	}

	fmt.Println("JWT Token:", tokenString)

	return tokenString, nil
}

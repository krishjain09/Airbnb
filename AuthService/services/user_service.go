package services

import (
	env "AuthService/config/env"
	db "AuthService/db/repositories"
	"AuthService/dto"
	"AuthService/models"
	"AuthService/utils"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	GetUserById(id string) (*models.User, error)
	Create(payload *dto.RegisterUserDTO) error
	LoginUser(payload *dto.LoginUserrequestDTO) (string, error)
}

type UserServiceImpl struct {
	userRepository db.UserRepository
	roleService    RoleService
}

func NewUserService(_userRepository db.UserRepository, _roleService RoleService) UserService {
	return &UserServiceImpl{
		userRepository: _userRepository,
		roleService:    _roleService,
	}
}

func (u *UserServiceImpl) GetUserById(id string) (*models.User, error) {
	fmt.Println("Fetching User in UserService")
	user, err := u.userRepository.GetById(id)

	if user == nil {
		fmt.Println("No user found with the given ID")
		return nil, fmt.Errorf("no user found with ID: %s", id)
	}
	if err != nil {
		fmt.Println("Error fetching user by ID:", err)
		return nil, err
	}
	return user, nil
}

func (u *UserServiceImpl) Create(payload *dto.RegisterUserDTO) error {
	fmt.Println("Creating User in UserService")
	username := payload.Username
	email := payload.Email
	password := payload.Password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		fmt.Println("Error in hashing password", err)
		return err
	}
	id, err := u.userRepository.Create(username, email, hashedPassword)

	if id == -1 {
		fmt.Println("Error creating user, no rows affected")
		return fmt.Errorf("error creating user, no rows affected")
	}
	if err != nil {
		return fmt.Errorf("email already exists")
	}

	roleId := 2 //Assuming 2 is the default role ID for a new user

	AssignRoleErr := u.roleService.AssignRoleToUser(id, int64(roleId))

	if AssignRoleErr != nil {
		fmt.Println("Error assigning role to user:", AssignRoleErr)
		return AssignRoleErr
	}

	return nil
}

func (u *UserServiceImpl) LoginUser(payload *dto.LoginUserrequestDTO) (string, error) {

	email := payload.Email
	password := payload.Password

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
		return "", fmt.Errorf("password does not match")
	}
	fmt.Println(user.Username)
	fmt.Println(user.Id)
	// Step 4. If password matches, print a JWT token, else return error saying password does not match
	jwtPayload := jwt.MapClaims{
		"username": user.Username,
		"id":       user.Id,
	}

	fmt.Println("JWT Payload:", jwtPayload)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtPayload)

	tokenString, err := token.SignedString([]byte(env.GetString("JWT_SECRET", "TOKEN")))

	if err != nil {
		fmt.Println("Error signing token:", err)
		return "", err
	}

	fmt.Println("JWT Token:", tokenString)

	return tokenString, nil
}

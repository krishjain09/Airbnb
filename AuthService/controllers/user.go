package controllers

import (
	"AuthService/dto"
	"AuthService/services"
	"AuthService/utils"

	"fmt"
	"net/http"
)

type UserController struct {
	UserService services.UserService
}

func NewUserController(_userService services.UserService) *UserController {
	return &UserController{
		UserService: _userService,
	}
}

func (uc *UserController) GetUserById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GetUserById called in UserController")

	uc.UserService.GetUserById()
	w.Write([]byte("User fetching endpoint done"))
}

func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser called in UserController")

	var payload dto.RegisterUserDTO

	if jsonErr := utils.ReadJsonBody(r, &payload); jsonErr != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Something went wrong while logging in", jsonErr)
		return
	}

	fmt.Println("Registry Payload received", payload)

	if validationErr := utils.Validator.Struct(&payload); validationErr != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid input data", validationErr)
		return
	}
	err := uc.UserService.Create(&payload)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Something went wrong while Registering", err)
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusCreated, "User Registered successfully", payload)
	w.Write([]byte("CreateUser fetching endpoint done"))
}

func (uc *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login-user called in UserController")

	var payload dto.LoginUserrequestDTO

	if jsonErr := utils.ReadJsonBody(r, &payload); jsonErr != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Something went wrong while logging in", jsonErr)
		return
	}

	fmt.Println("Payload received", payload)

	if validationErr := utils.Validator.Struct(&payload); validationErr != nil {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid input data", validationErr)
		return
	}

	jwtToken, err := uc.UserService.LoginUser(&payload)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Something went wrong while logging in", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User logged in successfully", jwtToken)

	w.Write([]byte("Login-user fetching endpoint done"))
}

package controllers

import (
	"AuthService/dto"
	"AuthService/middleware"
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

	payload := r.Context().Value(middleware.Payload).(dto.RegisterUserDTO)

	fmt.Println("Registry Payload received", payload)

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

	reqBodyPayload := r.Context().Value(middleware.Payload).(dto.LoginUserrequestDTO)

	fmt.Println("Payload received", reqBodyPayload)

	jwtToken, err := uc.UserService.LoginUser(&reqBodyPayload)

	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Something went wrong while logging in", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User logged in successfully", jwtToken)

	w.Write([]byte("Login-user fetching endpoint done"))

}

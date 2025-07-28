package middleware

import (
	"AuthService/dto"
	"AuthService/utils"
	"context"
	"fmt"
	"net/http"
)

type payloadkey string

const Payload payloadkey = "payload"

func UserLoginRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("UserLoginRequestValidator Middleware called.")
		var payload dto.LoginUserrequestDTO

		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		if err := utils.Validator.Struct(&payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusUnauthorized, "validation failed", err)
			return
		}
		fmt.Println("payload received", payload)

		req_context := r.Context() // Original context coming from the request

		ctx := context.WithValue(req_context, Payload, payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserCreateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("UserCreateRequestValidator Middleware called.")
		var payload dto.RegisterUserDTO

		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		if err := utils.Validator.Struct(&payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusUnauthorized, "validation failed", err)
			return
		}
		fmt.Println("payload received", payload)

		req_context := r.Context() // Original context coming from the request

		ctx := context.WithValue(req_context, Payload, payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

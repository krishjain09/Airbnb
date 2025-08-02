package middlewares

import (
	dbConfig "AuthService/config/db"
	env "AuthService/config/env"
	repo "AuthService/db/repositories"
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func JWTAuthMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, "Authorization Header is required", http.StatusUnauthorized)
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Authorization Header muststart with Bearer", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		if token == "" {
			http.Error(w, "Token is required", http.StatusUnauthorized)
			return
		}

		claims := jwt.MapClaims{}

		_, err := jwt.ParseWithClaims(token, &claims, func(t *jwt.Token) (any, error) {
			return []byte(env.GetString("JWT_SECRET", "TOKEN")), nil
		})

		if err != nil {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		username, okUsername := claims["username"].(string)
		userId, okid := claims["id"].(float64)

		if !okid || !okUsername {
			fmt.Println("Invalid Token claims okUsername:", okUsername, "okid:", okid)
			http.Error(w, "Invalid Token claims", http.StatusUnauthorized)
			return
		}
		fmt.Println("Authenticated User:", username, "ID:", userId)

		req_context := r.Context()

		ctx := context.WithValue(req_context, "Username", username)
		ctx = context.WithValue(ctx, "UserId", strconv.FormatFloat(userId, 'f', 0, 64))

		next.ServeHTTP(w, r.WithContext(ctx))

	})
}

func RequireAllRoles(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userIdStr := r.Context().Value("UserId").(string)
			userId, err := strconv.ParseInt(userIdStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			dbConn, dbErr := dbConfig.SetUpDB()
			if dbErr != nil {
				http.Error(w, "Database connection error: "+dbErr.Error(), http.StatusInternalServerError)
				return
			}

			urr := repo.NewUserRoleRepository(dbConn)
			hasAllRoles, hasAllRolesErr := urr.HasAllRoles(userId, roles)
			fmt.Println("userid", userId, "roles", roles, "hasAllRoles", hasAllRoles)
			if hasAllRolesErr != nil {
				http.Error(w, "Error checking user roles: "+hasAllRolesErr.Error(), http.StatusInternalServerError)
				return
			}

			if !hasAllRoles {
				http.Error(w, "Forbidden: You do not have the required roles", http.StatusForbidden)
				return
			}

			fmt.Println("User has all required roles:", roles)

			next.ServeHTTP(w, r)
		})
	}
}



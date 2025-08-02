package router

import (
	"AuthService/controllers"
	"AuthService/middlewares"
	"AuthService/utils"

	"github.com/go-chi/chi/v5"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router, RoleRouter Router) *chi.Mux {

	chirouter := chi.NewRouter()
	chirouter.Use(middlewares.RateLimiter)

	// Define your routes here
	chirouter.Get("/ping", controllers.PingHandler)
	chirouter.HandleFunc("/fakestoreservice/*", utils.ProxyToService("https://fakestoreapi.in", "/fakestoreservice"))
	UserRouter.Register(chirouter)
	RoleRouter.Register(chirouter)
	return chirouter
}

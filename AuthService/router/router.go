package router

import (
	"AuthService/controllers"
	"AuthService/middlewares"

	"github.com/go-chi/chi/v5"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router) *chi.Mux {

	chirouter := chi.NewRouter()
	chirouter.Use(middlewares.RateLimiter)

	// Define your routes here
	chirouter.Get("/ping", controllers.PingHandler)

	UserRouter.Register(chirouter)
	return chirouter
}

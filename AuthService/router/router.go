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
	// chirouter.Use(middlewares.RateLimiter)

	// Define your routes here
	chirouter.Get("/ping", controllers.PingHandler)
	
	chirouter.HandleFunc("/fakestoreservice/*", utils.ProxyToService("https://fakestoreapi.in", "/fakestoreservice"));

	chirouter.With(middlewares.JWTAuthMiddleWare,middlewares.RequireAnyRoles("user","admin")).HandleFunc("/bookings",utils.ProxyToService("http://localhost:3000/api/v1","/bookings"));
	chirouter.With(middlewares.JWTAuthMiddleWare,middlewares.RequireAnyRoles("user","admin")).HandleFunc("/bookings/*",utils.ProxyToService("http://localhost:3000/api/v1","/bookings"));
	
	UserRouter.Register(chirouter)
	RoleRouter.Register(chirouter)
	return chirouter
}

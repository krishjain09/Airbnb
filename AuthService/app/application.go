package app

import (
	"AuthService/controllers"
	db "AuthService/db/repositories"
	"AuthService/router"
	"AuthService/services"
	"fmt"
	"net/http"
	"time"
)

type Config struct {
	Addr string
}

type Application struct {
	Config Config
	Store  db.Storage
}

// Constructor for Config
func NewConfig(addr string) Config {
	return Config{
		Addr: addr,
	}
}

// Constructor for Application
func NewApplication(cfg Config) *Application {
	return &Application{
		Config: cfg,
	}
}

func (app *Application) Run() error {

	ur := db.NewUserRepsoitory()
	us := services.NewUserService(ur)
	uc := controllers.NewUserController(us)
	uRouter := router.NewUserRouter(uc)

	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(uRouter),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Println("Starting server on", app.Config.Addr)

	return server.ListenAndServe()
}

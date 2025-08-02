package app

import (
	dbConfig "AuthService/config/db"
	"AuthService/controllers"
	repo "AuthService/db/repositories"
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

	db, err := dbConfig.SetUpDB()

	if err != nil {
		fmt.Println("Error setting up database: ", err)
		return err
	}

	ur := repo.NewUserRepository(db)
	us := services.NewUserService(ur)
	uc := controllers.NewUserController(us)
	uRouter := router.NewUserRouter(uc)

	rolerepo := repo.NewRoleRepository(db)
	rolepermissionrepo := repo.NewRolePermissionRepository(db)
	userrolerepo := repo.NewUserRoleRepository(db)
	rs := services.NewRoleService(rolerepo, rolepermissionrepo, userrolerepo)
	rc := controllers.NewRoleController(rs)
	rRouter := router.NewRoleRouter(rc)

	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(uRouter, rRouter),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Println("Starting server on", app.Config.Addr)

	return server.ListenAndServe()
}

package app

import (
	"fmt"
	"net/http"
	"time"
)

type Config struct{
	Addr string
}

type Application struct{
	Config Config
}

//Constructor for Config
func NewConfig(addr string) Config{
	return Config{
		Addr: addr,
	}
}

//Constructor for Application
func NewApplication(cfg Config) *Application {
	return &Application{
		Config: cfg,
	}
}


func (app *Application) Run() error {
	server := &http.Server{
		Addr: app.Config.Addr,
		Handler: nil,
		ReadTimeout: 10  * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	fmt.Println("Starting server on", app.Config.Addr)

	return server.ListenAndServe()
}


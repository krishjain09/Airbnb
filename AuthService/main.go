package main

import (
	"AuthService/app"
	dbConfig "AuthService/config/db"
	config "AuthService/config/env"
)

func main() {

	config.Load()

	addr := config.GetString("PORT", ":3001")

	cfg := app.NewConfig(addr)
	app := app.NewApplication(cfg)
	dbConfig.SetUpDB()
	app.Run()
}

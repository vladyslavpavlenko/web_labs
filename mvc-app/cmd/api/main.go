package main

import (
	"github.com/vladyslavpavlenko/peparesu/internal/app"
	"github.com/vladyslavpavlenko/peparesu/internal/app/config"
)

func main() {
	err := app.Run(config.New())
	if err != nil {
		panic(err)
	}
}

package main

import (
	"fmt"

	"github.com/fodelf/cssbattle/database"
	"github.com/fodelf/cssbattle/pkg/setting"
	"github.com/fodelf/cssbattle/routers"
)

func main() {
	setting.Setup()
	database.InitEngine()
	// fmt.Println("sss")
	// service.ConnectDB()
	port := fmt.Sprintf(":%d", setting.ServerSetting.HttpPort)
	router := routers.InitRouter()
	router.Run(port)
}

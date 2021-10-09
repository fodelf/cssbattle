/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-02 10:18:56
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-05 15:02:30
 */
package main

import (
	"fmt"
	"net/http"

	"github.com/fodelf/cssbattle-im/database"
	"github.com/fodelf/cssbattle-im/pkg/setting"
	router "github.com/fodelf/cssbattle-im/routers"
	v1 "github.com/fodelf/cssbattle-im/routers/v1"
)

func main() {
	setting.Setup()
	database.InitEngine()
	// fmt.Println("sss")
	// service.ConnectDB()
	port := fmt.Sprintf(":%d", setting.ServerSetting.HttpPort)
	fmt.Println(port)
	http.HandleFunc("/api/v1/im/message", router.Chat)
	http.HandleFunc("/api/v1/im/join", v1.Join)
	http.ListenAndServe(port, nil)
	//  router := routers.InitRouter()
	//  router.Run(port)
}

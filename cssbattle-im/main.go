/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-02 10:18:56
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-12 11:57:37
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

func receiveClientRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")             //允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type") //header的类型
	w.Header().Set("content-type", "application/json")             //返回数据格式是json
	r.ParseForm()
	fmt.Println("收到客户端请求: ", r.Form)
}
func main() {
	setting.Setup()
	database.InitEngine()
	// fmt.Println("sss")
	// service.ConnectDB()
	port := fmt.Sprintf(":%d", setting.ServerSetting.HttpPort)
	fmt.Println(port)

	// addr := flag.String("addr", ":9528", "HTTPS network address")
	// mux := http.NewServeMux()
	http.HandleFunc("/", receiveClientRequest)
	http.HandleFunc("/api/v1/im/message", router.Chat)
	http.HandleFunc("/api/v1/im/join", v1.Join)
	// clientCertFile := flag.String("clientcert", "clientcert.pem", "certificate PEM for client authentication")
	// // clientCert, err := os.ReadFile(*clientCertFile)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// clientCertPool := x509.NewCertPool()
	// clientCertPool.AppendCertsFromPEM(clientCert)
	// srv := &http.Server{
	// 	Addr:    *addr,
	// 	Handler: mux,
	// 	TLSConfig: &tls.Config{
	// 		MinVersion:               tls.VersionTLS13,
	// 		PreferServerCipherSuites: true,
	// 		ClientCAs:                clientCertPool,
	// 		ClientAuth:               tls.RequireAndVerifyClientCert,
	// 	},
	// }
	// err := srv.ListenAndServeTLS("./Nginx/1_cssbattle.wuwenzhou.com.cn_bundle.crt", "./Nginx/2_cssbattle.wuwenzhou.com.cn.key")
	// log.Fatal(err)
	http.ListenAndServe(port, nil)
	// http.ListenAndServeTLS(port, "./Nginx/1_cssbattle.wuwenzhou.com.cn_bundle.crt", "./Nginx/2_cssbattle.wuwenzhou.com.cn.key", nil)
	//  router := routers.InitRouter()
	//  router.Run(port)
}

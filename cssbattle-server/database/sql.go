package database

import (
	"context"
	"log"

	"github.com/fodelf/cssbattle/pkg/setting"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MgoCli *mongo.Client

func InitEngine() {
	// mongoURI := fmt.Sprintf("mongodb://%s:%s@%s:%d/cssbattle", url.QueryEscape("admin"), url.QueryEscape("123456"), "110.42.220.32", 27017)
	// // mongoURI := "mongodb://admin:123456@110.42.220.32:27017/cssbattle"
	// fmt.Println("connection string is:", mongoURI)
	var err error
	credential := options.Credential{
		Username: setting.MongoSetting.Username,
		Password: setting.MongoSetting.Password,
	}
	clientOptions := options.Client().ApplyURI(setting.MongoSetting.Url).SetAuth(credential)
	// clientOptions := options.Client().ApplyURI(mongoURI)

	// 连接到MongoDB
	MgoCli, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	// 检查连接
	err = MgoCli.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
}
func GetMgoCli() *mongo.Client {
	if MgoCli == nil {
		InitEngine()
	}
	return MgoCli
}

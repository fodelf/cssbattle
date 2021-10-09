package setting

import (
	"log"

	"github.com/go-ini/ini"
)

type Server struct {
	RunMode  string
	HttpPort int
}
type Mongo struct {
	Username string
	Password string
	Url      string
}
type Url struct {
	AiUrl string
}
type Oss struct {
	Endpoint        string
	AccessKeyId     string
	AccessKeySecret string
	BucketName      string
}

var ServerSetting = &Server{}
var MongoSetting = &Mongo{}
var UrlSetting = &Url{}
var OssSetting = &Oss{}
var cfg *ini.File

// Setup initialize the configuration instance
func Setup() {
	var err error
	cfg, err = ini.Load("conf/app.ini")
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse 'conf/app.ini': %v", err)
	}
	mapTo("server", ServerSetting)
	mapTo("mango", MongoSetting)
	mapTo("url", UrlSetting)
	mapTo("oss", OssSetting)
}

// mapTo map section
func mapTo(section string, v interface{}) {
	err := cfg.Section(section).MapTo(v)
	if err != nil {
		log.Fatalf("Cfg.MapTo %s err: %v", section, err)
	}
}

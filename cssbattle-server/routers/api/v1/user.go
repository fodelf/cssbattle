package v1

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/EDDYCJY/go-gin-example/pkg/app"
	"github.com/fodelf/cssbattle/database"
	"github.com/fodelf/cssbattle/models/InterfaceEntity"
	"github.com/fodelf/cssbattle/pkg/e"
	"github.com/fodelf/cssbattle/pkg/jwt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// @Tags  用户模块
// @Summary 用户登录
// @Description 登录详情信息
// @Accept  json
// @Produce  json
// @Param username path string true "username"  用户名
// @Param password path string true "password"  密码
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/user/login [post]
func Login(c *gin.Context) {
	appG := app.Gin{C: c}
	var userInfo InterfaceEntity.UserInfo
	c.ShouldBind(&userInfo)
	fmt.Println(userInfo)
	filter := bson.D{{"username", userInfo.UserName}, {"password", userInfo.Password}}
	var user InterfaceEntity.UserInfo
	mg := database.NewMgo("user")
	err := database.FindByFitter(mg, filter).Decode(&user)
	fmt.Println("user", user)
	token, _ := jwt.GenerateToken(user)
	if err == mongo.ErrNoDocuments {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else if err != nil {
		log.Fatal(err)
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		mg := database.NewMgo("token")
		var tokenInfo InterfaceEntity.TokenInfo
		tokenInfo.Token = token
		tokenInfo.ExpireDate = time.Now()
		_, err := database.InsertOne(mg, tokenInfo)
		if err != nil {
			appG.Response(http.StatusInternalServerError, e.ERROR, nil)
		} else {
			appG.Response(http.StatusOK, e.SUCCESS, map[string]interface{}{
				"token": token,
			})
		}

	}

}

// @Tags  用户模块
// @Summary 获取用户信息
// @Description 根据token获取登录用户详情信息
// @Accept  json
// @Produce  json
// @Param token path string true "token" token值
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/user/getUser [post]
func GetUser(c *gin.Context) {
	appG := app.Gin{C: c}
	var tokenInfo InterfaceEntity.TokenInfo
	c.ShouldBind(&tokenInfo)
	filter := bson.D{{"token", tokenInfo.Token}}
	mg := database.NewMgo("token")
	err := database.FindOne(mg, filter).Decode(&tokenInfo)
	if err == mongo.ErrNoDocuments {
		appG.Response(http.StatusUnauthorized, e.INVALID_AUTH, nil)
	} else {
		user, err := jwt.ParseToken(tokenInfo.Token)
		if err != nil {
			appG.Response(http.StatusInternalServerError, e.ERROR, nil)
		} else {
			appG.Response(http.StatusOK, e.SUCCESS, user)
		}

	}

}

// @Tags  用户模块
// @Summary 用户注册
// @Description 用户注册详情
// @Accept  json
// @Produce  json
// @Param username path string true "username"  用户名
// @Param password path string true "password"  密码
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/user/register [post]
func Register(c *gin.Context) {
	appG := app.Gin{C: c}
	var userInfo InterfaceEntity.UserInfo
	c.ShouldBind(&userInfo)
	timer := time.Now().Format("2006-01-02 15:04:05")
	userInfo.CreateTime = timer
	userInfo.ModifyTime = timer
	// userInfo.ExpireDate = time.Now()
	mg := database.NewMgo("user")
	db := database.GetMgoCli().Database("css_db")
	collection := db.Collection("user")
	filter := bson.D{{"username", userInfo.UserName}}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var user InterfaceEntity.UserInfo
	err := collection.FindOne(ctx, filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		userInfo.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
		_, err1 := database.InsertOne(mg, userInfo)
		if err1 != nil {
			appG.Response(http.StatusInternalServerError, e.ERROR, nil)
		} else {
			appG.Response(http.StatusOK, e.SUCCESS, nil)
		}
	} else if err != nil {
		log.Fatal(err)
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	}

}

// @Tags  用户模块
// @Summary 用户排行查询
// @Description 用户排行查询详情
// @Accept  json
// @Produce  json
// @Success 200 {array} InterfaceEntity.UserInfo	Result 成功后返回值
// @Router /api/v1/user/sort [get]
func Sort(c *gin.Context) {
	appG := app.Gin{C: c}
	mg := database.NewMgo("user")
	cur, err := database.FindAll(mg, "score", 10, -1)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		var results []*InterfaceEntity.UserInfo
		for cur.Next(context.TODO()) {
			// create a value into which the single document can be decoded
			var user InterfaceEntity.UserInfo
			err := cur.Decode(&user)
			if err != nil {
				log.Fatal(err)
			}

			results = append(results, &user)
		}
		appG.Response(http.StatusOK, e.SUCCESS, results)
	}

}

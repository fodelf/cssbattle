/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-06 22:03:16
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-07 23:16:44
 */
package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/EDDYCJY/go-gin-example/pkg/app"
	"github.com/fodelf/cssbattle/database"
	InterfaceEntity "github.com/fodelf/cssbattle/models/InterfaceEntity"
	"github.com/fodelf/cssbattle/pkg/e"
	"github.com/fodelf/cssbattle/pkg/jwt"
	"github.com/fodelf/cssbattle/pkg/setting"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/create [post]
func AuditionCreate(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var AuditionInfo InterfaceEntity.AuditionInfo
	c.ShouldBind(&AuditionInfo)
	timer := time.Now().Format("2006-01-02 15:04:05")
	AuditionInfo.CreateTime = timer
	AuditionInfo.ModifyTime = timer
	AuditionInfo.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
	//如果不存在token
	if Token != "null" {
		fmt.Println("Token", Token)
		mg := database.NewMgo("audition")
		user, _ := jwt.ParseToken(Token)
		fmt.Println("Token", user)
		AuditionInfo.UserId = user.UserId
		res, _ := database.InsertOne(mg, AuditionInfo)
		appG.Response(http.StatusOK, e.SUCCESS, res)
	} else {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	}

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/getAuditionList [post]

func GetAuditionList(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	//如果不存在token
	if Token != "null" {
		mg := database.NewMgo("audition")
		user, _ := jwt.ParseToken(Token)
		var results []*InterfaceEntity.AuditionInfo
		filter := bson.D{{"userid", user.UserId}}
		cur, _ := database.QueryAll(mg, "createtime", 100, -1, filter)
		for cur.Next(context.TODO()) {
			// create a value into which the single document can be decoded
			var res InterfaceEntity.AuditionInfo
			err := cur.Decode(&res)
			if err != nil {
				log.Fatal(err)
			}
			results = append(results, &res)
		}
		appG.Response(http.StatusOK, e.SUCCESS, results)
	} else {
		appG.Response(http.StatusUnauthorized, e.INVALID_AUTH, nil)	
		// appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	}

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/create [post]
func AuditionCreateCss(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var AuditionCssIdList InterfaceEntity.AuditionCssIdList
	c.ShouldBind(&AuditionCssIdList)

	timer := time.Now().Format("2006-01-02 15:04:05")
	// AuditionInfo.Id = primitive.NewObjectID()
	//如果不存在token
	if Token != "null" {
		// fmt.Println("Token", Token)
		mg := database.NewMgo("audition_css")
		// user, _ := jwt.ParseToken(Token)
		fmt.Println("AuditionCssIdList.CssIdList", AuditionCssIdList)
		// AuditionInfo.UserId = user.UserName
		// var results [] InterfaceEntity.AuditionCss
		for _, value := range AuditionCssIdList.CssIdList {
			var res InterfaceEntity.AuditionCss
			res.AuditionId = AuditionCssIdList.AuditionId
			res.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
			res.CssID = value
			res.CreateTime = timer
			res.ModifyTime = timer
			_, _ = database.InsertOne(mg, res)
			// results = append(results, res)
		}
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	} else {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	}

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func GetAuditionCssList(c *gin.Context) {
	appG := app.Gin{C: c}
	// Token := c.GetHeader("Token")
	var AuditionCssInfo InterfaceEntity.AuditionCssInfo
	c.ShouldBind(&AuditionCssInfo)
	//如果不存在token
	// if Token != "null" {
	mg := database.NewMgo("audition_css")
	var results []*InterfaceEntity.AuditionCss
	fmt.Println("AuditionCssIdList.AuditionId", AuditionCssInfo)
	filter := bson.D{{"auditionid", AuditionCssInfo.AuditionId}}
	cur, _ := database.QueryAll(mg, "createtime", 100, -1, filter)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.AuditionCss
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, &res)
	}
	appG.Response(http.StatusOK, e.SUCCESS, results)
	// } else {
	// 	appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	// }

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func GetAuditionDetail(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssInfo InterfaceEntity.AuditionCssInfo
	c.ShouldBind(&AuditionCssInfo)
	mg := database.NewMgo("audition")
	// filter := bson.D{{"_id", AuditionCssInfo.AuditionId}}
	// obj_id, _ := primitive.ObjectIDFromHex(AuditionCssInfo.AuditionId)
	filter := bson.M{"_id": AuditionCssInfo.AuditionId}
	fmt.Println("Audition._id", AuditionCssInfo.AuditionId)
	var AuditionInfo InterfaceEntity.AuditionInfo
	database.FindOne(mg, filter).Decode(&AuditionInfo)
	fmt.Println("Audition", AuditionInfo)
	appG.Response(http.StatusOK, e.SUCCESS, AuditionInfo)
}

// @Tags  图片模块
// @Summary 图片比较得分
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param code path string true "code"  编辑器代码
// @Param id path string true "id"  图片id
// @Success 200 {object} InterfaceEntity.Score Result 成功后返回值
// @Router /api/v1/img/imgCompare [post]
func AuditionIMGCompare(c *gin.Context) {
	appG := app.Gin{C: c}
	var imgContent InterfaceEntity.AuditionImgInfo
	c.ShouldBind(&imgContent)
	str := strings.Replace(imgContent.Code, " ", "", -1)
	// 去除换行符
	str = strings.Replace(str, "\n", "", -1)
	fmt.Println("str", str)
	chars := utf8.RuneCountInString(str)
	fmt.Println("chars", chars)
	id := imgContent.Id
	mg := database.NewMgo("cssbattle_" + id)
	scale, _ := database.FindSort(mg, "chars", chars)
	// fmt.Println(scale)
	imgContent.Scale = scale
	b, _ := json.Marshal(imgContent)
	var body = strings.NewReader(string(b))
	url := setting.UrlSetting.AiUrl + "compare"
	fmt.Println("url=====", url)
	response, _ := http.Post(url, "application/json; charset=utf-8", body)
	resbody, _ := ioutil.ReadAll(response.Body)
	tempMap := map[string]float32{
		"match": 0.0,
		"score": 0.0,
	}
	_ = json.Unmarshal([]byte(resbody), &tempMap)
	auditionMg := database.NewMgo("audition_css_result")
	filter := bson.D{{"auditionid", imgContent.AuditionId}, {"userid", imgContent.UserId}, {"cssid", id}}
	var auditionResult InterfaceEntity.AuditionResult
	err := database.FindOne(auditionMg, filter).Decode(&auditionResult)
	var audition = &InterfaceEntity.AuditionResult{
		CssID:      id,
		UserId:     imgContent.UserId,
		Score:      tempMap["score"],
		Chars:      chars,
		Match:      tempMap["match"],
		Code:       imgContent.Code,
		AuditionId: imgContent.AuditionId,
	}
	// 如果不存在新增
	if err == mongo.ErrNoDocuments {
		database.InsertOne(auditionMg, audition)
	} else {
		update := bson.M{"$set": audition}
		database.UpdateManyByFilter(auditionMg, filter, update)
	}
	appG.Response(http.StatusOK, e.SUCCESS, tempMap)
}

// @Tags  图片模块
// @Summary 图片比较得分
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param code path string true "code"  编辑器代码
// @Param id path string true "id"  图片id
// @Success 200 {object} InterfaceEntity.Score Result 成功后返回值
// @Router /api/v1/img/imgCompare [post]
func GetAuditionIMGCompare(c *gin.Context) {
	appG := app.Gin{C: c}
	var imgContent InterfaceEntity.AuditionImgDeatileInfo
	c.ShouldBind(&imgContent)
	auditionMg := database.NewMgo("audition_css_result")
	filter := bson.D{{"auditionid", imgContent.AuditionId}, {"userid", imgContent.UserId}, {"cssid", imgContent.Id}}
	var auditionResult InterfaceEntity.AuditionResult
	err := database.FindOne(auditionMg, filter).Decode(&auditionResult)
	// 如果不存在新增
	if err == mongo.ErrNoDocuments {
		appG.Response(http.StatusOK, e.SUCCESS, auditionResult)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, auditionResult)
	}

}

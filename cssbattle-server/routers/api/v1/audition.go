/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-06 22:03:16
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-02-08 23:09:50
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
	if Token != "" {
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
	if Token != "" {
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
	if Token != "" {
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
	var results = make([]InterfaceEntity.AuditionCss, 0)
	fmt.Println("AuditionCssIdList.AuditionId", AuditionCssInfo)
	filter := bson.D{{"auditionid", AuditionCssInfo.AuditionId}}
	cur, _ := database.QueryAll(mg, "createtime", 100000, -1, filter)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.AuditionCss
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	fmt.Println("-----", results)
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
	mg := database.NewMgo("cssbattle")
	cssbattleFilter := bson.D{{"imgid", id}}
	scale, _ := database.FindSort(mg, "chars", chars, cssbattleFilter)
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
		appG.Response(http.StatusOK, e.SUCCESS, tempMap)
	} else {
		update := bson.M{"$set": audition}
		_, err := database.UpdateManyByFilter(auditionMg, filter, update)
		if err != nil {
			appG.Response(http.StatusOK, e.SUCCESS, tempMap)
		}
	}

}

// @Tags  面试模块
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
	if err == mongo.ErrNoDocuments {
		appG.Response(http.StatusOK, e.SUCCESS, auditionResult)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, auditionResult)
	}

}

// @Tags  面试模块
// @Summary 图片比较得分
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param code path string true "code"  编辑器代码
// @Param id path string true "id"  图片id
// @Success 200 {object} InterfaceEntity.Score Result 成功后返回值
// @Router /api/v1/img/imgCompare [post]
func DeleteCSS(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssRequestInfo InterfaceEntity.AuditionCssRequestInfo
	c.ShouldBind(&AuditionCssRequestInfo)
	auditionMg := database.NewMgo("audition_css")
	filter := bson.D{{"_id", AuditionCssRequestInfo.Id}, {"auditionid", AuditionCssRequestInfo.AuditionId}}
	_, err := database.Delete(auditionMg, filter)
	// 如果不存在新增
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_CSS_DELETE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/create [post]
func AuditionCreateExercise(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var ExerciseInfo InterfaceEntity.ExerciseInfo
	var ExerciseUserInfo InterfaceEntity.ExerciseUserInfo
	c.ShouldBind(&ExerciseInfo)
	timer := time.Now().Format("2006-01-02 15:04:05")
	mg := database.NewMgo("audition_exercise")
	mg1 := database.NewMgo("audition_exercise_user")
	fmt.Println(ExerciseInfo)
	user, _ := jwt.ParseToken(Token)
	ExerciseInfo.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
	ExerciseInfo.UserId = user.UserId
	ExerciseInfo.CreateTime = timer
	ExerciseInfo.ModifyTime = timer
	ExerciseUserInfo.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
	ExerciseUserInfo.Answer = ExerciseInfo.Answer
	ExerciseUserInfo.Name = ExerciseInfo.Name
	ExerciseUserInfo.Content = ExerciseInfo.Content
	ExerciseUserInfo.Options = ExerciseInfo.Options
	ExerciseUserInfo.Describe = ExerciseInfo.Describe
	ExerciseUserInfo.UserId = user.UserId
	ExerciseUserInfo.CreateTime = timer
	ExerciseUserInfo.ModifyTime = timer

	_, err := database.InsertOne(mg, ExerciseInfo)
	_, err1 := database.InsertOne(mg1, ExerciseUserInfo)
	if err != nil && err1 != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_EXE_CREATE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func GetAuditionExerciseList(c *gin.Context) {
	appG := app.Gin{C: c}
	// Token := c.GetHeader("Token")
	var AuditionCssInfo InterfaceEntity.AuditionCssInfo
	c.ShouldBind(&AuditionCssInfo)
	//如果不存在token
	// if Token != "null" {
	mg := database.NewMgo("audition_exercise")
	var results = make([]InterfaceEntity.ExerciseInfo, 0)
	filter := bson.D{{"auditionid", AuditionCssInfo.AuditionId}}
	cur, _ := database.QueryAll(mg, "createtime", 100000, -1, filter)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.ExerciseInfo
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	appG.Response(http.StatusOK, e.SUCCESS, results)

}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func GetExerciseList(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var AuditionCssInfo InterfaceEntity.AuditionCssInfo
	c.ShouldBind(&AuditionCssInfo)
	//如果不存在token
	// if Token != "null" {
	mg := database.NewMgo("audition_exercise_user")
	var results = make([]InterfaceEntity.ExerciseRInfo, 0)
	user, _ := jwt.ParseToken(Token)
	filter := bson.D{{"userid", user.UserId}}
	cur, _ := database.QueryAll(mg, "createtime", 100000, -1, filter)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.ExerciseRInfo
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	appG.Response(http.StatusOK, e.SUCCESS, results)
}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/create [post]
func AuditionCreateExerciseByLib(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionIdExerciseList InterfaceEntity.AuditionIdExerciseList
	c.ShouldBind(&AuditionIdExerciseList)
	timer := time.Now().Format("2006-01-02 15:04:05")
	mg := database.NewMgo("audition_exercise")
	mg1 := database.NewMgo("audition_exercise_user")
	fmt.Println("ExerciseInfo", AuditionIdExerciseList.ExerciseIdList)
	for _, value := range AuditionIdExerciseList.ExerciseIdList {
		filter := bson.D{{"_id", value}}
		var ExerciseInfo InterfaceEntity.ExerciseInfo
		database.FindOne(mg1, filter).Decode(&ExerciseInfo)
		fmt.Println("ExerciseInfo", ExerciseInfo)
		ExerciseInfo.AuditionId = AuditionIdExerciseList.AuditionId
		ExerciseInfo.Id = primitive.ObjectID.Hex(primitive.NewObjectID())
		ExerciseInfo.CreateTime = timer
		ExerciseInfo.ModifyTime = timer
		_, _ = database.InsertOne(mg, ExerciseInfo)
	}
	appG.Response(http.StatusOK, e.SUCCESS, nil)

}

// @Tags  面试模块
// @Summary 图片比较得分
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param code path string true "code"  编辑器代码
// @Param id path string true "id"  图片id
// @Success 200 {object} InterfaceEntity.Score Result 成功后返回值
// @Router /api/v1/img/imgCompare [post]
func DeleteExercise(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssRequestInfo InterfaceEntity.AuditionCssRequestInfo
	c.ShouldBind(&AuditionCssRequestInfo)
	auditionMg := database.NewMgo("audition_exercise")
	filter := bson.D{{"_id", AuditionCssRequestInfo.Id}, {"auditionid", AuditionCssRequestInfo.AuditionId}}
	_, err := database.Delete(auditionMg, filter)
	// 如果不存在新增
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_CSS_DELETE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func GetAuditionExerciseDetail(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssInfo InterfaceEntity.AuditionCssRequestInfo
	c.ShouldBind(&AuditionCssInfo)
	mg := database.NewMgo("audition_exercise")
	filter := bson.D{{"_id", AuditionCssInfo.Id}, {"auditionid", AuditionCssInfo.AuditionId}}
	var ExerciseInfo InterfaceEntity.ExerciseInfo
	database.FindOne(mg, filter).Decode(&ExerciseInfo)
	appG.Response(http.StatusOK, e.SUCCESS, ExerciseInfo)
}

// @Tags  面试模块
// @Summary 新建面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param name path string true "name"  面试名称
// @Router /api/v1/audition/GetAuditionCssList [post]

func UpdateAuditionExercise(c *gin.Context) {
	appG := app.Gin{C: c}
	var ExerciseInfo InterfaceEntity.ExerciseInfo
	c.ShouldBind(&ExerciseInfo)
	mg := database.NewMgo("audition_exercise")
	filter := bson.D{{"_id", ExerciseInfo.Id}}
	fmt.Println(ExerciseInfo)
	timer := time.Now().Format("2006-01-02 15:04:05")
	ExerciseInfo.ModifyTime = timer
	var ExerciseInfo1 InterfaceEntity.ExerciseInfo
	database.FindOne(mg, filter).Decode(&ExerciseInfo1)
	ExerciseInfo.UserId = ExerciseInfo1.UserId
	ExerciseInfo.CreateTime = ExerciseInfo1.CreateTime
	fmt.Println("ExerciseInfo", ExerciseInfo)
	update := bson.M{"$set": ExerciseInfo}
	_, err := database.UpdateManyByFilter(mg, filter, update)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_EXE_UPDATE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
}

// @Tags  面试模块
// @Summary 图片比较得分
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param code path string true "code"  编辑器代码
// @Param id path string true "id"  图片id
// @Success 200 {object} InterfaceEntity.Score Result 成功后返回值
// @Router /api/v1/img/imgCompare [post]
func DeleteAudition(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionRInfo InterfaceEntity.AuditionRInfo
	c.ShouldBind(&AuditionRInfo)
	auditionMg := database.NewMgo("audition")
	filter := bson.D{{"_id", AuditionRInfo.Id}}
	_, err := database.Delete(auditionMg, filter)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_Audition_DELETE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
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
func AuditionExerciseCompare(c *gin.Context) {
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
	mg := database.NewMgo("cssbattle")
	cssbattleFilter := bson.D{{"imgid", id}}
	scale, _ := database.FindSort(mg, "chars", chars, cssbattleFilter)
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
		appG.Response(http.StatusOK, e.SUCCESS, tempMap)
	} else {
		update := bson.M{"$set": audition}
		_, err := database.UpdateManyByFilter(auditionMg, filter, update)
		if err != nil {
			appG.Response(http.StatusOK, e.SUCCESS, tempMap)
		}
	}

}

// @Tags  面试模块
// @Summary 开始面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param id path string true "id"  面试id
// @Router /api/v1/audition/startAudition [post]

func StartAudition(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionRInfo InterfaceEntity.AuditionRInfo
	c.ShouldBind(&AuditionRInfo)
	mg := database.NewMgo("audition")
	filter := bson.D{{"_id", AuditionRInfo.Id}}
	timer := time.Now().Format("2006-01-02 15:04:05")
	var AuditionInfo InterfaceEntity.AuditionInfo
	database.FindOne(mg, filter).Decode(&AuditionInfo)
	AuditionInfo.StartTime = timer
	AuditionInfo.State = 1
	fmt.Println("AuditionInfo", AuditionInfo)
	update := bson.M{"$set": AuditionInfo}
	_, err := database.UpdateByFilter(mg, filter, update)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_EXE_UPDATE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
}

// @Tags  面试模块
// @Summary 结束面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param id path string true "id"  面试id
// @Router /api/v1/audition/startAudition [post]
func EndAudition(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionRInfo InterfaceEntity.AuditionRInfo
	c.ShouldBind(&AuditionRInfo)
	mg := database.NewMgo("audition")
	filter := bson.D{{"_id", AuditionRInfo.Id}}
	var AuditionInfo InterfaceEntity.AuditionInfo
	fmt.Println("AuditionInfo", AuditionInfo)
	database.FindOne(mg, filter).Decode(&AuditionInfo)
	AuditionInfo.State = 2
	AuditionInfo.Count = AuditionInfo.Count + 1
	update := bson.M{"$set": AuditionInfo}
	_, err := database.UpdateByFilter(mg, filter, update)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_EXE_UPDATE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
}

// @Tags  面试模块
// @Summary 重置面试
// @Description 上传代码以及图片id获取得分
// @Accept  json
// @Produce  json
// @Param id path string true "id"  面试id
// @Router /api/v1/audition/startAudition [post]
func RefreshAudition(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionRInfo InterfaceEntity.AuditionRInfo
	c.ShouldBind(&AuditionRInfo)
	mg := database.NewMgo("audition")
	filter := bson.D{{"_id", AuditionRInfo.Id}}
	var AuditionInfo InterfaceEntity.AuditionInfo
	database.FindOne(mg, filter).Decode(&AuditionInfo)
	AuditionInfo.State = 0
	update := bson.M{"$set": AuditionInfo}
	_, err := database.UpdateManyByFilter(mg, filter, update)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_EXE_UPDATE, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
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
func ExerciseSubmit(c *gin.Context) {
	appG := app.Gin{C: c}
	var ExerciseResult InterfaceEntity.ExerciseResult
	c.ShouldBind(&ExerciseResult)
	auditionMg := database.NewMgo("audition_exercise_result")
	filter := bson.D{{"auditionid", ExerciseResult.AuditionId}, {"userid", ExerciseResult.UserId}, {"exerciseid", ExerciseResult.ExerciseId}}
	var ExerciseResult1 InterfaceEntity.ExerciseResult
	err := database.FindOne(auditionMg, filter).Decode(&ExerciseResult1)
	var ExerciseUserInfo InterfaceEntity.ExerciseUserInfo
	mg := database.NewMgo("audition_exercise")
	filter1 := bson.D{{"_id", ExerciseResult.ExerciseId}}
	database.FindOne(mg, filter1).Decode(&ExerciseUserInfo)
	ExerciseResult.RightAnswer = ExerciseUserInfo.Answer
	ExerciseResult.Options = ExerciseUserInfo.Options
	if err == mongo.ErrNoDocuments {
		database.InsertOne(auditionMg, ExerciseResult)
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	} else {
		update := bson.M{"$set": ExerciseResult}
		_, _ = database.UpdateManyByFilter(auditionMg, filter, update)
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
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
func GetExerciseDetail(c *gin.Context) {
	appG := app.Gin{C: c}
	var ExerciseDetailResult InterfaceEntity.ExerciseDetailResult
	c.ShouldBind(&ExerciseDetailResult)
	mg := database.NewMgo("audition_exercise_result")
	filter := bson.D{{"auditionid", ExerciseDetailResult.AuditionId}, {"userid", ExerciseDetailResult.UserId}, {"exerciseid", ExerciseDetailResult.ExerciseId}}
	var ExerciseResult1 InterfaceEntity.ExerciseDResult
	err := database.FindOne(mg, filter).Decode(&ExerciseResult1)
	if err == mongo.ErrNoDocuments {
		appG.Response(http.StatusOK, e.SUCCESS, []string{})
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, ExerciseResult1)
	}
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
func UpdateAuditionInfo(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionInfoChildInfo InterfaceEntity.AuditionInfoChildInfo
	c.ShouldBind(&AuditionInfoChildInfo)
	auditionMg := database.NewMgo("audition")
	filter := bson.D{{"_id", AuditionInfoChildInfo.Id}}
	var AuditionInfo InterfaceEntity.AuditionInfo
	database.FindOne(auditionMg, filter).Decode(&AuditionInfo)
	AuditionInfo.AuditionMesInfo = AuditionInfoChildInfo
	update := bson.M{"$set": AuditionInfo}
	_, _ = database.UpdateManyByFilter(auditionMg, filter, update)
	appG.Response(http.StatusOK, e.SUCCESS, nil)
}

func GetCSSResultList(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssRInfo InterfaceEntity.AuditionCssRInfo
	c.ShouldBind(&AuditionCssRInfo)
	mg := database.NewMgo("audition_css_result")
	filter := bson.D{{"userid", AuditionCssRInfo.UserId}, {"auditionid", AuditionCssRInfo.Id}}
	cur, _ := database.QueryAll(mg, "cssid", 100000, -1, filter)
	var results = make([]InterfaceEntity.AuditionResult, 0)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.AuditionResult
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	appG.Response(http.StatusOK, e.SUCCESS, results)
}
func GetExerciseResultList(c *gin.Context) {
	appG := app.Gin{C: c}
	var AuditionCssRInfo InterfaceEntity.AuditionCssRInfo
	c.ShouldBind(&AuditionCssRInfo)
	mg := database.NewMgo("audition_exercise_result")
	filter := bson.D{{"userid", AuditionCssRInfo.UserId}, {"auditionid", AuditionCssRInfo.Id}}
	cur, _ := database.QueryAll(mg, "type", 100000, -1, filter)
	var results = make([]InterfaceEntity.ExerciseResult, 0)
	for cur.Next(context.TODO()) {
		// create a value into which the single document can be decoded
		var res InterfaceEntity.ExerciseResult
		err := cur.Decode(&res)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	appG.Response(http.StatusOK, e.SUCCESS, results)
}

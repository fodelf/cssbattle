package v1

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/EDDYCJY/go-gin-example/pkg/app"
	"github.com/fodelf/cssbattle/database"
	InterfaceEntity "github.com/fodelf/cssbattle/models/InterfaceEntity"
	"github.com/fodelf/cssbattle/pkg/e"
	"github.com/fodelf/cssbattle/pkg/jwt"
	"github.com/fodelf/cssbattle/pkg/setting"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// @Tags  图片模块
// @Summary oss上传
// @Description 图片上传oss
// @Accept  json
// @Produce  json
// @Param file path string true "file"  用户名
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/img/UploadSvg [post]
func UploadSvg(c *gin.Context) {
	appG := app.Gin{C: c}
	f, err := c.FormFile("file") //和从请求中获取携带的参数一样
	fmt.Println(f.Filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	} else {
		//将读取到的文件保存到本地(服务端)
		fmt.Sprintf("./%s", f.Filename)
		// dst := path.Join("./", f.Filename)
		// _ = c.SaveUploadedFile(f, dst)
		// c.JSON(http.StatusOK, gin.H{
		// 	"status": "ok",
		// })
	}
	appG.Response(http.StatusOK, e.SUCCESS, map[string]interface{}{})

}

// @Tags  图片模块
// @Summary 图片列表
// @Description 根据资源类型获取图片详情列表
// @Accept  json
// @Produce  json
// @Param type path string true "type"  类型
// @Success 200 {object} object Result 成功后返回值
// @Router /api/v1/img/getImgList [get]
func GetImgList(c *gin.Context) {
	appG := app.Gin{C: c}
	// "_id": ObjectId("61342b98e8161f16f64751c2"),"id": 1212324234,"imgUrl": "http://cssbattle.oss-cn-beijing.aliyuncs.com/img/1123123.png", "type": "1","describe": "PILOT"
	var (
		imgList []map[string]interface{} = []map[string]interface{}{}
	)
	var img = map[string]interface{}{
		"id":       1212324234,
		"imgUrl":   "http://cssbattle.oss-cn-beijing.aliyuncs.com/img/1123123.png",
		"type":     "1",
		"describe": "PILOT",
	}
	imgList = append(imgList, img)
	appG.Response(http.StatusOK, e.SUCCESS, map[string]interface{}{
		"imgList": imgList,
	})

}

var floatType = reflect.TypeOf(float64(0))

func getFloat(unk interface{}) (float64, error) {
	v := reflect.ValueOf(unk)
	v = reflect.Indirect(v)
	if !v.Type().ConvertibleTo(floatType) {
		return 0, fmt.Errorf("cannot convert %v to float32", v.Type())
	}
	fv := v.Convert(floatType)
	return fv.Float(), nil
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
func IMGCompare(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var imgContent InterfaceEntity.CompareImgInfo
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
	response, err := http.Post(url, "application/json; charset=utf-8", body)
	if err != nil {
		// fmt.Println(response)
	} else {
		// fmt.Println(err)
	}
	resbody, _ := ioutil.ReadAll(response.Body)
	// resString := string(resbody)
	// fmt.Println(resString)
	tempMap := map[string]float32{
		"match": 0.0,
		"score": 0.0,
	}
	// var tempMap InterfaceEntity.Score
	err1 := json.Unmarshal([]byte(resbody), &tempMap)
	if err1 != nil {
		panic(err1)
	}
	//如果不存在token
	if Token != "" {
		user, _ := jwt.ParseToken(Token)
		filter := bson.D{{"username", user.UserName}}
		var userImg InterfaceEntity.UserImg
		database.FindOne(mg, filter).Decode(&userImg)
		userMg := database.NewMgo("user")
		userFilter := bson.D{{"username", user.UserName}}
		var userImgInfo InterfaceEntity.UserInfo
		database.FindOne(userMg, userFilter).Decode(&userImgInfo)
		cssString := "Cssbattle_" + id
		if userImg.UserName == "" {
			userImg.Chars = chars
			userImg.Match = tempMap["match"]
			userImg.Score = tempMap["score"]
			userImg.UserName = user.UserName
			userImg.UserIcon = user.UserIcon
			userImg.Code = imgContent.Code
			_, _ = database.InsertOne(mg, userImg)
			update := bson.D{
				{"$max", bson.D{
					{"score", userImgInfo.Score + tempMap["score"]},
					{cssString, tempMap["score"]},
				}},
				{"$inc", bson.D{
					{"target", 1},
				}},
			}
			fmt.Println("update", update)
			database.UpdateMany(userMg, "username", user.UserName, update)
		} else {
			userImg.Chars = chars
			userImg.Match = tempMap["match"]
			userImg.Score = tempMap["score"]
			userImg.UserName = user.UserName
			userImg.UserIcon = user.UserIcon
			userImg.Code = imgContent.Code
			t := reflect.TypeOf(userImgInfo)
			v := reflect.ValueOf(userImgInfo)
			var userScore = 0.0
			// fmt.Println("cssString", cssString)
			for k := 0; k < t.NumField(); k++ {
				// fmt.Println("t.Field(k).Name", t.Field(k).Name)
				if t.Field(k).Name == cssString {
					userScore, err = getFloat(v.Field(k).Interface())
					break
				}
			}
			fmt.Println("userScore", userScore)
			if float32(userScore) < tempMap["score"] {
				update := bson.D{
					{"$max", bson.D{
						{"score", userImgInfo.Score + (tempMap["score"] - float32(userScore))},
						{cssString, tempMap["score"]},
					}},
				}
				database.UpdateMany(userMg, "username", user.UserName, update)
				updateMg := bson.M{"$set": userImg}
				database.Update(mg, "username", user.UserName, updateMg)
			}
		}
		// 	if userScore == 0 {

		// 	} else {
		// 		if tempMap["score"] > userImgInfo.Score {
		// 			update := bson.D{
		// 				{"$max", bson.D{
		// 					{"score", userImgInfo.Score + (tempMap["score"] - userImgInfo[cssString])},
		// 					{cssString, tempMap["score"]},
		// 				}},
		// 				{"$inc", bson.D{
		// 					{"target", 1},
		// 				}},
		// 			}
		// 			database.UpdateMany(userMg, "username", user.UserName, update)
		// 		}

		// 	}
		// var userImg InterfaceEntity.UserImg

	}
	fmt.Println(tempMap)
	// var imgResInfo InterfaceEntity.ImgResInfo
	// // var dat map[string]interface{}
	// if err := json.Unmarshal([]byte(resbody), &imgResInfo); err == nil {
	// 	fmt.Println("================json str 转struct==")
	// 	fmt.Println(imgResInfo)
	// }
	// fmt.Println(imgResInfo)
	appG.Response(http.StatusOK, e.SUCCESS, tempMap)
}

// @Tags  图片模块
// @Summary 图片详细
// @Description 根据图片id获取图片详情
// @Accept  json
// @Produce  json
// @Param type path string true "id"  图片id
// @Success 200 {object} object Result 成功后返回值
// @Router /api/v1/img/getImgDetail [get]
func GetImgDetail(c *gin.Context) {
	appG := app.Gin{C: c}
	mg := database.NewMgo("img")
	id := c.Query("id")
	intId, _ := strconv.Atoi(id)
	filter := bson.D{{"id", intId}}
	var imgInfo InterfaceEntity.ImgInfo
	database.FindOne(mg, filter).Decode(&imgInfo)
	appG.Response(http.StatusOK, e.SUCCESS, imgInfo)
}

// @Tags  图片模块
// @Summary cssbattle类型列表
// @Description cssbattle类型列表详情
// @Accept  json
// @Produce  json
// @Success 200 {object} InterfaceEntity.BattleType Result 成功后返回值
// @Router /api/v1/img/getCssbattleTypeList [get]
func GetCssbattleTypeList(c *gin.Context) {
	appG := app.Gin{C: c}
	mg := database.NewMgo("cssbattleType")
	cur, err := database.FindAll(mg, "type", 100, -1)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		var results []*InterfaceEntity.BattleType
		for cur.Next(context.TODO()) {
			// create a value into which the single document can be decoded
			var res InterfaceEntity.BattleType
			err := cur.Decode(&res)
			if err != nil {
				log.Fatal(err)
			}

			results = append(results, &res)
		}
		appG.Response(http.StatusOK, e.SUCCESS, results)
	}
}

// @Tags  图片模块
// @Summary 添加图片
// @Description 添加图片数据
// @Accept  json
// @Produce  json
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/img/addImg [post]
func AddIMG(c *gin.Context) {
	appG := app.Gin{C: c}
	var imgInfo InterfaceEntity.ImgInfo
	c.ShouldBind(&imgInfo)
	mg := database.NewMgo("img")
	_, err := database.InsertOne(mg, imgInfo)
	if err != nil {
		log.Fatal(err)
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}

}

// @Tags  图片模块
// @Summary 图片详细
// @Description 根据图片id获取图片详情
// @Accept  json
// @Produce  json
// @Param type path string true "id"  图片id
// @Success 200 {object} object Result 成功后返回值
// @Router /api/v1/img/getUserImgDetail [get]
func GetUserImgDetail(c *gin.Context) {
	appG := app.Gin{C: c}
	Token := c.GetHeader("Token")
	var userImg InterfaceEntity.UserImg
	if Token != "" {
		id := c.Query("id")
		mg := database.NewMgo("cssbattle_" + id)
		user, _ := jwt.ParseToken(Token)
		filter := bson.D{{"username", user.UserName}}
		var userImg InterfaceEntity.UserImg
		database.FindOne(mg, filter).Decode(&userImg)
		appG.Response(http.StatusOK, e.SUCCESS, userImg)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, userImg)
	}
}

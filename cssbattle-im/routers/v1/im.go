package v1

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fodelf/cssbattle-im/database"
	"github.com/fodelf/cssbattle-im/models/InterfaceEntity"
	"go.mongodb.org/mongo-driver/bson"
)

type Response struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

func IsContain(items []string, item string) bool {
	for _, eachItem := range items {
		if eachItem == item {
			return true
		}
	}
	return false
}

// @Tags  用户模块
// @Router /api/v1/im/join [post]
func Join(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	// 根据请求body创建一个json解析器实例
	decoder := json.NewDecoder(request.Body)
	// 用于存放参数key=value数据
	var params map[string]string
	// 解析参数 存入map
	decoder.Decode(&params)
	fmt.Println(params["userId"], params["roomId"])
	roomId := params["roomId"]
	userId := params["userId"]
	IMMg := database.NewMgo("im")
	fmt.Println("roomId---------------------", roomId)
	fmt.Println("userId---------------------", userId)
	roomFilter := bson.D{{"roomid", roomId}}
	var ImInfo InterfaceEntity.IMInfo
	database.FindOne(IMMg, roomFilter).Decode(&ImInfo)
	writer.Header().Set("content-type", "text/json")
	fmt.Println("ImInfo---------------------", ImInfo)
	if ImInfo.RoomID == "" {
		newImInfo := InterfaceEntity.IMInfo{
			RoomID:   roomId,
			UserList: []string{userId},
		}
		_, err := database.InsertOne(IMMg, newImInfo)
		if err != nil {
			res := Response{
				500,
				"fail",
				"加入房间失败",
			}
			json.NewEncoder(writer).Encode(res)
		} else {
			res := Response{
				200,
				"success",
				"加入房间成功",
			}
			json.NewEncoder(writer).Encode(res)
		}
	} else {
		if IsContain(ImInfo.UserList, userId) {
			fmt.Println("用户已经加入")
			res := Response{
				200,
				"success",
				"用户加入已经存在的房间成功",
			}
			json.NewEncoder(writer).Encode(res)
		} else {
			fmt.Println("用户追加")
			//不包含
			oldList := ImInfo.UserList
			newImInfo := InterfaceEntity.IMInfo{
				RoomID:   roomId,
				UserList: append(oldList, userId),
			}
			updateMg := bson.M{"$set": newImInfo}
			database.Update(IMMg, "roomid", roomId, updateMg)
			res := Response{
				200,
				"success",
				"用户加入已经存在房间",
			}
			json.NewEncoder(writer).Encode(res)
		}
	}

}

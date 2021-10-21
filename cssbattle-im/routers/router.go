/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-02 10:36:35
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-20 22:58:18
 */
package router

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/fodelf/cssbattle-im/database"
	"github.com/fodelf/cssbattle-im/models/InterfaceEntity"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"gopkg.in/fatih/set.v0"
)

//本核心在于形成userid和Node的映射关系
type Node struct {
	Conn *websocket.Conn
	//并行转串行,
	DataQueue chan []byte
	UserId    string
	GroupSets set.Interface
}

//定义命令行格式
const (
	CmdSingleMsg = iota
	CmdRoomMsg
	CmdHeart
)

type Message struct {
	UserId  string                 `json:"userId,omitempty" form:"userId"`   //谁发的
	Cmd     int                    `json:"cmd,omitempty" form:"cmd"`         //群聊还是私聊
	RoomId  string                 `json:"roomId,omitempty" form:"roomId"`   //对端用户ID/群ID
	Content map[string]interface{} `json:"content,omitempty" form:"content"` //消息的内容
}

//后端调度逻辑处理
func dispatch(data []byte) {
	msg := Message{}
	err := json.Unmarshal(data, &msg)
	if err != nil {
		log.Println(err.Error())
		return
	}
	// fmt.Println(msg.Cmd)
	fmt.Println("roomid------------------------", msg.RoomId)
	// fmt.Println(CmdRoomMsg)
	switch msg.Cmd {
	case CmdSingleMsg:
		// sendMsg(msg.Dstid, data)
	case CmdRoomMsg:
		IMMg := database.NewMgo("im")
		roomFilter := bson.D{{"roomid", msg.RoomId}}
		var ImInfo InterfaceEntity.IMInfo
		database.FindOne(IMMg, roomFilter).Decode(&ImInfo)
		// fmt.Println(ImInfo.UserList)
		// fmt.Println("child----msg.UserId-----", msg.UserId)
		fmt.Println("clientMap", clientMap)
		for _, v := range ImInfo.UserList {
			fmt.Println("child----v-----", v)
			if v != msg.UserId {
				fmt.Println("child----v-----ggggggg", v)
				child, ok := clientMap[v]
				if ok {
					fmt.Println("发送到小管道")
					// err = child.Conn.WriteMessage(websocket.TextMessage, data)
					// if err != nil {
					// 	log.Println(err.Error())
					// 	return
					// }
					child.DataQueue <- data
				} else {
					fmt.Println("key不存在", v)
				}
				// if _, ok := clientMap[v]; ok {
				// 	child := clientMap[v]
				// 	fmt.Println("child----sddddddddd-----", child)
				// 	child.DataQueue <- data
				// 	// err = child.Conn.WriteMessage(websocket.TextMessage, data)
				// 	// if err != nil {
				// 	// 	log.Println(err.Error())
				// 	// 	return
				// 	// }
				// }
			}
		}
		// for _, v := range clientMap {
		// 	fmt.Println(v.GroupSets)
		// 	if v.GroupSets.Has(msg.Dstid) {
		// 		v.DataQueue <- data
		// 	}
		// }
	case CmdHeart:
		//检测客户端的心跳
	}
}

//userid和Node映射关系表
var clientMap map[string]*Node = make(map[string]*Node)
var PostsById map[string]*Node

//读写锁
var rwlocker sync.RWMutex

func MapToJson(param map[string]interface{}) string {
	dataType, _ := json.Marshal(param)
	dataString := string(dataType)
	return dataString
}

//实现聊天的功能
func Chat(writer http.ResponseWriter, request *http.Request) {
	query := request.URL.Query()
	userId := query.Get("userId")
	roomId := query.Get("roomId")
	fmt.Println("userId", userId)
	fmt.Println("roomId", roomId)
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	// token := query.Get("token")
	// userId, _ := strconv.ParseInt(id, 10, 64)
	//校验token是否合法
	// islegal := checkToken(userId, token)

	conn, err := (&websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}).Upgrade(writer, request, nil)

	if err != nil {
		log.Println(err.Error())
		return
	}
	//获得websocket链接conn
	node := &Node{
		Conn:      conn,
		DataQueue: make(chan []byte, 1000),
		GroupSets: set.New(set.ThreadSafe),
		UserId:    userId,
	}
	// IMMg := database.NewMgo("im")
	// roomFilter := bson.D{{"roomid", roomId}}
	// var ImInfo InterfaceEntity.IMInfo
	// database.FindOne(IMMg, roomFilter).Decode(&ImInfo)
	fmt.Println("userId------", userId)
	// clientMap[userId] = node
	rwlocker.Lock()
	clientMap[userId] = node
	rwlocker.Unlock()
	// node.GroupSets.Add(roomId)
	// for _, v := range ImInfo.UserList {
	// 	if v != userId {
	// 		node.GroupSets.Add(v)
	// 		// childNodeX := clientMap[v]
	// 		// go func(childNode *Node) {
	// 		// 	sendproc(childNode)
	// 		// }(childNodeX)
	// 		// fmt.Println("userId===", v)
	// 	}
	// }
	//开启协程处理发送逻辑
	go sendproc(node)

	//开启协程完成接收逻辑
	go recvproc(node)
	// fmt.Println("链接结束")
	// str := `{"Cmd":"1","userId":userId}`
	// mmp := make(map[string]interface{})
	// mmp["name"] = "Mr.Sun"
	// mmp["age"] = 18
	// mmp["niubility"] = true

	// JSONMap := map[string]interface{}{"Cmd": 1, "userId": userId, "roomId": roomId, "content": map[string]interface{}{"type": "WebRtc:addRemote"}}
	// json, err := json.Marshal(JSONMap)
	// if err != nil {
	// 	fmt.Println("json err:", err)
	// }
	// // jsonStr := MapToJson(JSONMap)
	// dispatch([]byte(string(json)))
	// sendMsg(userId, []byte(jsonStr))
}

//添加新的群ID到用户的groupset中
func AddGroupId(userId string, gid int64) {
	//取得node
	rwlocker.Lock()
	node, ok := clientMap[userId]
	if ok {
		node.GroupSets.Add(gid)
	}
	rwlocker.Unlock()
}

//发送逻辑
func sendproc(node *Node) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("write stop")

		}
	}()
	defer func() {
		delete(clientMap, node.UserId)
		node.Conn.Close()
		fmt.Println("Client发送数据 defer")
	}()
	for {
		select {
		case data := <-node.DataQueue:
			fmt.Printf("发送消息")
			msg := Message{}
			err := json.Unmarshal(data, &msg)
			if err != nil {
				log.Println(err.Error())
				return
			}
			fmt.Println("msg.UserId", msg.UserId)
			fmt.Println("node.UserId", node.UserId)
			// if msg.UserId != node.UserId {
			err = node.Conn.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				fmt.Printf("发送消息失败")
				log.Println(err.Error())
				return
				// }
			}

		}
	}
}

//接收逻辑
func recvproc(node *Node) {
	fmt.Printf("接收消息")
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("write stop")
		}
	}()

	defer func() {
		fmt.Println("读取客户端数据 关闭send")
		close(node.DataQueue)
	}()
	for {
		_, data, err := node.Conn.ReadMessage()
		if err != nil {
			log.Println(err.Error())
			return
		}
		// node.Conn.WriteMessage(websocket.TextMessage, data)
		// fmt.Printf("发送成功")
		dispatch(data)
		//todo对data进一步处理
		// fmt.Printf("recv<=%s", data)
	}
}

//发送消息,发送到消息的管道
func sendMsg(userId string, msg []byte) {
	rwlocker.RLock()
	node, ok := clientMap[userId]
	rwlocker.RUnlock()
	if ok {
		node.DataQueue <- msg
	}
}

//校验token是否合法
func checkToken(userId string, token string) bool {
	// user := UserService.Find(userId)
	// return user.Token == token
	return true
}

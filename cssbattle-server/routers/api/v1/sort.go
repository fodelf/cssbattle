package v1

import (
	"context"
	"log"
	"net/http"

	"github.com/EDDYCJY/go-gin-example/pkg/app"
	"github.com/fodelf/cssbattle/database"
	"github.com/fodelf/cssbattle/models/InterfaceEntity"
	"github.com/fodelf/cssbattle/pkg/e"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// @Tags  排行模块
// @Summary 单个挑战排行查询
// @Description 单个挑战排行查询详情
// @Accept  json
// @Produce  json
// @Param type path string true "id"  单个battle的ID
// @Success 200 {array} InterfaceEntity.UserImg	Result 成功后返回值
// @Router /api/v1/sort/sortById [get]
func SortById(c *gin.Context) {
	appG := app.Gin{C: c}
	id := c.Query("id")
	mg := database.NewMgo("cssbattle")
	filter := bson.D{{"imgid", id}}
	cur, err := database.FindAll(mg, "score", 10, -1, filter)
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		var results []*InterfaceEntity.UserImg
		for cur.Next(context.TODO()) {
			// create a value into which the single document can be decoded
			var user InterfaceEntity.UserImg
			err := cur.Decode(&user)
			if err != nil {
				log.Fatal(err)
			}
			results = append(results, &user)
		}
		appG.Response(http.StatusOK, e.SUCCESS, results)
	}

}

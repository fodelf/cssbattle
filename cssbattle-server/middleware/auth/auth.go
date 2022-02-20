/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-07 21:50:26
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-02-07 09:18:23
 */
package auth

import (
	"fmt"
	"net/http"

	"github.com/fodelf/cssbattle/database"
	"github.com/fodelf/cssbattle/models/InterfaceEntity"
	"github.com/fodelf/cssbattle/pkg/app"
	"github.com/fodelf/cssbattle/pkg/e"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		Token := c.GetHeader("Token")
		fmt.Println("Token", Token)
		if Token != "" {
			appG := app.Gin{C: c}
			filter := bson.D{{"token", Token}}
			mg := database.NewMgo("token")
			var tokenInfo InterfaceEntity.TokenInfo
			err := database.FindOne(mg, filter).Decode(&tokenInfo)
			if err == mongo.ErrNoDocuments {
				appG.Response(http.StatusUnauthorized, e.INVALID_AUTH, nil)
				c.Abort()
			} else {
				c.Next()
			}
		} else {
			c.Next()
		}
	}
}

/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-08-27 15:03:49
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-05 14:54:15
 */
package database

import (
	"context"
	"fmt"
	_ "fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// TrainerModel
type Mgo struct {
	collection *mongo.Collection
}

// NewTrainer
func NewMgo(collectionName string) Mgo {
	var mgo Mgo
	mgo.collection = MgoCli.Database("css_db").Collection(collectionName)
	return mgo
}

// 查询单个
func FindOne(m Mgo, filter interface{}) *mongo.SingleResult {
	_, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	singleResult := m.collection.FindOne(context.TODO(), filter)
	if singleResult != nil {
		fmt.Println(singleResult)
	}
	return singleResult
}

// 插入单个
func InsertOne(m Mgo, document interface{}) (insertResult *mongo.InsertOneResult, err error) {
	insertResult, err = m.collection.InsertOne(context.TODO(), document)
	return insertResult, err
}

// 更新一个
func Update(m Mgo, key string, value interface{}, update interface{}) (updateResult *mongo.UpdateResult) {
	filter := bson.M{key: value}
	updateResult, err := m.collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	return updateResult
}

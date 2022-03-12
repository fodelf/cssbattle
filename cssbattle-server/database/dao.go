/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-08-27 15:03:49
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-12 10:21:38
 */
package database

import (
	"context"
	"fmt"
	_ "fmt"
	"log"
	"strconv"
	"time"

	"github.com/fodelf/cssbattle/models/InterfaceEntity"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// 集合名称
const TrainerCollectionName = "trainer"

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

// 插入单个
func InsertOne(m Mgo, document interface{}) (insertResult *mongo.InsertOneResult, err error) {
	// index := []mongo.IndexModel{
	// 	{
	// 		Keys: bsonx.Doc{{Key: "createdAt", Value: bsonx.Int32(1)}, {Key: "expireAfterSeconds", Value: bsonx.Int32(1)}},
	// 	},
	// }

	// opts := options.CreateIndexes().SetMaxTime(1 * time.Second)
	// _, _ = m.collection.Indexes().CreateMany(context.TODO(), index, opts)
	// if err != nil {
	// 	// panic(errIndex)
	// }
	// indexModel := mongo.IndexModel{
	// 	Keys:    bsonx.Doc{{"expiredate", bsonx.Int32(1)}}, // 设置TTL索引列"expire_date"
	// 	Options: options.Index().SetExpireAfterSeconds(1),  // 设置过期时间1天，即，条目过期一天过自动删除
	// }
	// _, err = m.collection.Indexes().CreateOne(context.Background(), indexModel)
	// indexModel := mongo.IndexModel{
	// 	Keys:    bsonx.Doc{{"expiredate", bsonx.Int32(1)}},               // 设置TTL索引列"expire_date"
	// 	Options: options.Index().SetExpireAfterSeconds(60 * 60 * 24 * 7), // 设置过期时间1天，即，条目过期一天过自动删除

	// }
	// _, err = m.collection.Indexes().CreateOne(context.Background(), indexModel)
	insertResult, err = m.collection.InsertOne(context.TODO(), document)
	return insertResult, err
}

// 插入多个
func InsertMany(m Mgo, documents []interface{}) (insertManyResult *mongo.InsertManyResult, err error) {
	insertManyResult, err = m.collection.InsertMany(context.TODO(), documents)
	if err != nil {
		fmt.Println(err)
	}
	return insertManyResult, err
}

// 查询单个
func FindByFitter(m Mgo, filter interface{}) *mongo.SingleResult {
	singleResult := m.collection.FindOne(context.TODO(), filter)
	return singleResult
}

// 查询单个
func FindOne(m Mgo, filter interface{}) *mongo.SingleResult {
	cxt, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cur := m.collection.FindOne(cxt, filter)
	// fmt.Println("FindOne", cur)
	return cur
}

// 查询count总数
func Count(m Mgo) int64 {
	size, _ := m.collection.EstimatedDocumentCount(context.TODO())
	return size
}

// 按选项查询集合
// Skip 跳过
// Limit 读取数量
// Sort  排序   1 倒叙 ， -1 正序
func FindAll(m Mgo, key string, Limit int64, sort int, filter interface{}) (cur *mongo.Cursor, err error) {
	SORT := bson.D{{key, sort}}
	_, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	//where
	findOptions := options.Find()
	findOptions.SetSort(SORT)
	findOptions.SetLimit(Limit)
	// findOptions.SetSkip(0)
	cur, err = m.collection.Find(context.TODO(), filter, findOptions)
	return cur, err
}

// 按选项查询集合
// Skip 跳过
// Limit 读取数量
// Sort  排序   1 倒叙 ， -1 正序
func QueryAll(m Mgo, key string, Limit int64, sort int, filter interface{}) (cur *mongo.Cursor, err error) {
	SORT := bson.D{{key, sort}}
	_, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	findOptions := options.Find()
	findOptions.SetSort(SORT)
	findOptions.SetLimit(Limit)
	// findOptions.SetSkip(0)
	cur, err = m.collection.Find(context.TODO(), filter, findOptions)
	return cur, err
}

// 按选项查询集合
// Skip 跳过
// Limit 读取数量
// Sort  排序   1 倒叙 ， -1 正序
func FindSort(m Mgo, key string, count int, filter interface{}) (scale float32, err error) {
	size, _ := m.collection.EstimatedDocumentCount(context.TODO())
	if size == 0 {
		return 1.0, err
	} else {
		SORT := bson.D{{key, 1}}
		_, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		//where
		findOptions := options.Find()
		findOptions.SetSort(SORT)
		cur, _ := m.collection.Find(context.TODO(), filter, findOptions)
		index := 0
		for cur.Next(context.TODO()) {
			// index++
			if index == 100 {
				return 0, nil
			} else {
				var user InterfaceEntity.UserImg
				err := cur.Decode(&user)
				if err != nil {
					log.Fatal(err)
				} else {
					if user.Chars > count {
						return ((100 - float32(index)) / 100), nil
					}
				}
			}
			index++
		}
		return 0, nil
	}

}

// 获取集合创建时间和编号
func (m *Mgo) ParsingId(result string) (time.Time, uint64) {
	temp1 := result[:8]
	timestamp, _ := strconv.ParseInt(temp1, 16, 64)
	dateTime := time.Unix(timestamp, 0) // 这是截获情报时间 时间格式 2019-04-24 09:23:39 +0800 CST
	temp2 := result[18:]
	count, _ := strconv.ParseUint(temp2, 16, 64) // 截获情报的编号
	return dateTime, count
}

// 删除
func Delete(m Mgo, filter interface{}) (DeletedCount int64, err error) {
	count, err := m.collection.DeleteOne(context.TODO(), filter, nil)
	return count.DeletedCount, err
}

// 删除多个
func (m *Mgo) DeleteMany(key string, value interface{}) int64 {
	filter := bson.D{{key, value}}
	count, err := m.collection.DeleteMany(context.TODO(), filter)
	if err != nil {
		fmt.Println(err)
	}
	return count.DeletedCount
}

// 更新一个
func UpdateMany(m Mgo, key string, value interface{}, update interface{}) (updateResult *mongo.UpdateResult) {
	filter := bson.D{{key, value}}
	updateResult, err := m.collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("updateResult", updateResult)
	return updateResult
}

// 更新一个
func UpdateManyByFilter(m Mgo, filter interface{}, update interface{}) (updateResult *mongo.UpdateResult, err error) {
	updateResult, err = m.collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("updateResult", updateResult)
	return updateResult, err
}

// 更新一个
func UpdateByFilter(m Mgo, filter interface{}, update interface{}) (updateResult *mongo.UpdateResult, err error) {
	updateResult, err = m.collection.UpdateMany(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("UpdateByFilter", updateResult)
	return updateResult, err
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

/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-06 22:05:22
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-26 22:37:02
 */
package InterfaceEntity

type BaseInfo struct {
	Id         string `json:"id" bson:"_id"`
	CreateTime string `json:"createTime"`
	ModifyTime string `json:"modifyTime"`
}
type AuditionInfoChildInfo struct {
	Id      string                 `json:"id" `
	Type    int                    `json:"type"`
	Content map[string]interface{} `json:"content"`
}

//面试实体
type AuditionInfo struct {
	Name            string                `json:"name"`
	StartTime       string                `json:"startTime"`
	CreateTime      string                `json:"createTime"`
	ModifyTime      string                `json:"modifyTime"`
	UserId          string                `json:"userId"`
	Count           int                   `json:"count"`
	Type            int                   `json:"type"`
	Id              string                `json:"id" bson:"_id"`
	State           int                   `json:"state"`
	AuditionMesInfo AuditionInfoChildInfo `json:"auditionInfo"`
}

// 面试查询条件实体
type AuditionFitter struct {
	PageSize   int `json:"pageSize"`
	PageNumber int `json:"pageNumber"`
}

// 面试css实体
type AuditionCss struct {
	AuditionId string `json:"auditionId"`
	CssID      string `json:"cssId"`
	CreateTime string `json:"createTime"`
	ModifyTime string `json:"modifyTime"`
	Id         string `json:"id" bson:"_id"`
}

// 面试css实体
type AuditionCssIdList struct {
	AuditionId string   `json:"auditionId"`
	CssIdList  []string `json:"cssIdList"`
}

// 面试css实体
type AuditionCssInfo struct {
	AuditionId string `json:"auditionId"`
}

// css面试结果
type AuditionResult struct {
	CssID      string  `json:"cssId"`
	UserId     string  `json:"userId"`
	Score      float32 `json:"score"`
	Chars      int     `json:"chars"`
	Match      float32 `json:"match"`
	Code       string  `json:"code"`
	AuditionId string  `json:"auditionId"`
}
type AuditionImgInfo struct {
	AuditionId string  `json:"auditionId"`
	Code       string  `json:"code"`
	Id         string  `json:"id"`
	UserId     string  `json:"userId"`
	Scale      float32 `json:"scale"`
}
type AuditionImgDeatileInfo struct {
	AuditionId string `json:"auditionId"`
	Id         string `json:"id"`
	UserId     string `json:"userId"`
}
type AuditionCssRequestInfo struct {
	Id         string `json:"id"`
	AuditionId string `json:"auditionId"`
}

type ExerciseInfo struct {
	Id         string                   `json:"id" bson:"_id"`
	CreateTime string                   `json:"createTime"`
	ModifyTime string                   `json:"modifyTime"`
	Name       string                   `json:"name"`
	Type       int                      `json:"type"`
	Content    string                   `json:"content"`
	Options    []map[string]interface{} `json:"options"`
	Answer     []string                 `json:"answer"`
	Describe   string                   `json:"describe"`
	UserId     string                   `json:"userId"`
	AuditionId string                   `json:"auditionId"`
}
type ExerciseUserInfo struct {
	Id         string                   `json:"id" bson:"_id"`
	CreateTime string                   `json:"createTime"`
	ModifyTime string                   `json:"modifyTime"`
	Name       string                   `json:"name"`
	Type       int                      `json:"type"`
	Content    string                   `json:"content"`
	Options    []map[string]interface{} `json:"options"`
	Answer     []string                 `json:"answer"`
	Describe   string                   `json:"describe"`
	UserId     string                   `json:"userId"`
}
type ExerciseRInfo struct {
	Id         string                   `json:"id" bson:"_id"`
	CreateTime string                   `json:"createTime"`
	ModifyTime string                   `json:"modifyTime"`
	Name       string                   `json:"name"`
	Type       int                      `json:"type"`
	Content    string                   `json:"content"`
	Options    []map[string]interface{} `json:"options"`
	Describe   string                   `json:"describe"`
	UserId     string                   `json:"userId"`
}
type AuditionIdExerciseList struct {
	AuditionId     string   `json:"auditionId"`
	ExerciseIdList []string `json:"exerciseIdList"`
}
type AuditionRInfo struct {
	Id string `json:"id"`
}
type ExerciseResult struct {
	Name        string                   `json:"name"`
	ExerciseId  string                   `json:"exerciseId"`
	UserId      string                   `json:"userId"`
	Answer      []string                 `json:"answer"`
	RightAnswer []string                 `json:"rightAnswer"`
	IsRight     bool                     `json:"isRight"`
	Options     []map[string]interface{} `json:"options"`
	AuditionId  string                   `json:"auditionId"`
	Type        int                      `json:"type"`
}
type ExerciseDetailResult struct {
	ExerciseId string `json:"exerciseId"`
	UserId     string `json:"userId"`
	AuditionId string `json:"auditionId"`
}

type ExerciseDResult struct {
	Answer []string `json:"answer"`
}
type AuditionCssRInfo struct {
	UserId string `json:"userId"`
	Id     string `json:"id"`
}

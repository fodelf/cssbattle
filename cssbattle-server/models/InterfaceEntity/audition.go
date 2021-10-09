/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-06 22:05:22
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-07 20:09:51
 */
package InterfaceEntity

//面试实体
type AuditionInfo struct {
	Name       string `json:"name"`
	CreateTime string `json:"createTime"`
	ModifyTime string `json:"modifyTime"`
	UserId     string `json:"userId"`
	Count      int    `json:"count"`
	Type       int    `json:"type"`
	Id         string `json:"id" bson:"_id"`
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

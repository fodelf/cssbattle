package InterfaceEntity

//汇总实体类
type Score struct {
	Score float32 `json:"score" example:"100"`
	Match float32 `json:"match" example:"1"`
}

//汇总实体类
type ImgInfo struct {
	Type   int      `json:"type"`
	Id     int      `json:"id"`
	ImgUrl string   `json:"imgUrl"`
	Colors []string `json:"colors"`
}
type CompareImgInfo struct {
	Code  string  `json:"code"`
	Id    string  `json:"id"`
	Scale float32 `json:"scale"`
}
type UserImg struct {
	UserName string  `json:"userName"`
	UserIcon string  `json:"userIcon"`
	Score    float32 `json:"score"`
	Chars    int     `json:"chars"`
	Match    float32 `json:"match"`
	Code     string  `json:"code"`
}

//汇总实体类
type ImgResInfo struct {
	Code string  `json:"code"`
	Data float32 `json:"id"`
	Msg  string  `json:"msg"`
}

//battle 类型
type BattleType struct {
	Type    int    `json:"type" `
	Des     string `json:"des"`
	ImgList []int  `json:"imgList"`
}

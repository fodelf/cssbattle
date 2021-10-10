package e

var MsgFlags = map[int]string{
	SUCCESS:               "ok",
	ERROR:                 "服务异常",
	INVALID_PARAMS:        "请求参数错误",
	ERROR_REJECT:          "注册失败",
	ERROR_LOGIN:           "登录失败",
	INVALID_AUTH:          "Token失效",
	ERROR_CSS_DELETE:      "删除图片失败",
	ERROR_EXE_CREATE:      "创建习题失败",
	ERROR_EXE_UPDATE:      "更新习题失败",
	ERROR_Audition_DELETE: "删除面试失败",
}

// GetMsg get error information based on Code
func GetMsg(code int) string {
	msg, ok := MsgFlags[code]
	if ok {
		return msg
	}

	return MsgFlags[ERROR]
}

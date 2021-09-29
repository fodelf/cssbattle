package routers

import (
	"github.com/gin-gonic/gin"

	_ "github.com/fodelf/cssbattle/docs"

	// proxy "gateway/middleware/proxy"
	v1 "github.com/fodelf/cssbattle/routers/api/v1"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// InitRouter initialize routing information
func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	// r.Use(proxy.ReverseProxy())
	// proxyMiddle := r.Group("/*")
	// proxyMiddle.Use(proxy.ReverseProxy())
	r.LoadHTMLGlob("web/*.html")          // 添加入口index.html
	r.LoadHTMLFiles("web/static/*/*")     // 添加资源路径
	r.Static("/static", "web/static")     // 添加资源路径
	r.StaticFile("/ui", "web/index.html") // 前端接口
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.MaxMultipartMemory = 1 // 上传文件大小限制
	apiRoot := r.Group("/api/v1")
	apiRoot.Use()
	// indexApi := apiRoot.Group("/index")
	// {
	// 	//获取首页汇总
	// 	indexApi.GET("/sum", v1.GetSum)
	// 	//获取图表信息
	// 	indexApi.GET("/charts", v1.GetCharts)
	// 	//实时状态查询
	// 	indexApi.GET("/actualTime", v1.GetActualTime)
	// 	//实时状态查询
	// 	indexApi.GET("/warningList", v1.GetWarningList)
	// }
	// eumnApi := apiRoot.Group("/eumn")
	// {
	// 	//服务类型
	// 	eumnApi.GET("/serverTypeList", v1.GetServerType)
	// }
	// 用户部分
	userApi := apiRoot.Group("/user")
	{
		//注册
		userApi.POST("/register", v1.Register)
		//登录
		userApi.POST("/login", v1.Login)
		//根据token获取user
		userApi.POST("/getUser", v1.GetUser)
		//根据token获取user
		userApi.GET("/sort", v1.Sort)

	}
	// 用户部分
	ossApi := apiRoot.Group("/oss")
	{
		// 上传oss
		ossApi.POST("/upload", v1.Upload)
	}
	// 用户部分
	imgApi := apiRoot.Group("/img")
	{
		// 图片相关
		imgApi.POST("/upload", v1.UploadSvg)
		// 图片列表
		imgApi.GET("/getImgList", v1.GetImgList)
		// 图片详情
		imgApi.GET("/getImgDetail", v1.GetImgDetail)
		// 图片详情
		imgApi.POST("/imgCompare", v1.IMGCompare)
		// 图片详情
		imgApi.GET("/getCssbattleTypeList", v1.GetCssbattleTypeList)
		// 添加图片
		imgApi.POST("/addIMG", v1.AddIMG)
		// 图片详情
		imgApi.GET("/getUserImgDetail", v1.GetUserImgDetail)
	}
	// 用户部分
	sortApi := apiRoot.Group("/sort")
	{
		// 图片相关
		sortApi.GET("/sortById", v1.SortById)
	}
	return r
}

package v1

import (
	"fmt"
	"net/http"

	"github.com/EDDYCJY/go-gin-example/pkg/app"
	"github.com/fodelf/cssbattle/pkg/e"
	oss "github.com/fodelf/cssbattle/pkg/oss"
	"github.com/gin-gonic/gin"
)

// @Tags  oss模块
// @Summary 上传oss
// @Description 上传oss详情
// @Accept  json
// @Produce  json
// @Param username path string true "username"  用户名
// @Success 200 {string} string	Result 成功后返回值
// @Router /api/v1/user/login [post]
type Component struct {
	Div   string
	Style string
}

func Upload(c *gin.Context) {
	appG := app.Gin{C: c}
	var component Component
	c.ShouldBind(&component)
	componentString := fmt.Sprintf(`
	class WebComponent extends HTMLElement {
        constructor() {
          super();
          const shadow = this.attachShadow({ mode: "open" });
          shadow.innerHTML = %s
          const style = document.createElement("style");
          style.textContent = %s;
          shadow.appendChild(style);
        }
      }
      customElements.define("web-component", WebComponent);
	`, "`"+component.Div+"`", "`"+component.Style+"`")
	fmt.Println(componentString)
	err := oss.UploadOss(componentString)
	// tmpl.
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR, nil)
	} else {
		appG.Response(http.StatusOK, e.SUCCESS, nil)
	}
}

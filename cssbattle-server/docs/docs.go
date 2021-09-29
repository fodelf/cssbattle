// GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag

package docs

import (
	"bytes"
	"encoding/json"
	"strings"

	"github.com/alecthomas/template"
	"github.com/swaggo/swag"
)

var doc = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{.Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "license": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/v1/img/UploadSvg": {
            "post": {
                "description": "图片上传oss",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "oss上传",
                "parameters": [
                    {
                        "type": "string",
                        "description": "file",
                        "name": "file",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/api/v1/img/addImg": {
            "post": {
                "description": "添加图片数据",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "添加图片",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/api/v1/img/getCssbattleTypeList": {
            "get": {
                "description": "cssbattle类型列表详情",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "cssbattle类型列表",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/InterfaceEntity.BattleType"
                        }
                    }
                }
            }
        },
        "/api/v1/img/getImgDetail": {
            "get": {
                "description": "根据图片id获取图片详情",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "图片详细",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "type",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    }
                }
            }
        },
        "/api/v1/img/getImgList": {
            "get": {
                "description": "根据资源类型获取图片详情列表",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "图片列表",
                "parameters": [
                    {
                        "type": "string",
                        "description": "type",
                        "name": "type",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    }
                }
            }
        },
        "/api/v1/img/imgCompare": {
            "post": {
                "description": "上传代码以及图片id获取得分",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图片模块"
                ],
                "summary": "图片比较得分",
                "parameters": [
                    {
                        "type": "string",
                        "description": "code",
                        "name": "code",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/InterfaceEntity.Score"
                        }
                    }
                }
            }
        },
        "/api/v1/sort/sortById": {
            "get": {
                "description": "单个挑战排行查询详情",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "排行模块"
                ],
                "summary": "单个挑战排行查询",
                "parameters": [
                    {
                        "type": "string",
                        "description": "id",
                        "name": "type",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/InterfaceEntity.UserImg"
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/user/getUser": {
            "post": {
                "description": "根据token获取登录用户详情信息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户模块"
                ],
                "summary": "获取用户信息",
                "parameters": [
                    {
                        "type": "string",
                        "description": "token",
                        "name": "token",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/api/v1/user/login": {
            "post": {
                "description": "登录详情信息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户模块"
                ],
                "summary": "用户登录",
                "parameters": [
                    {
                        "type": "string",
                        "description": "username",
                        "name": "username",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "password",
                        "name": "password",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/api/v1/user/register": {
            "post": {
                "description": "用户注册详情",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户模块"
                ],
                "summary": "用户注册",
                "parameters": [
                    {
                        "type": "string",
                        "description": "username",
                        "name": "username",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "password",
                        "name": "password",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/api/v1/user/sort": {
            "get": {
                "description": "用户排行查询详情",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户模块"
                ],
                "summary": "用户排行查询",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/InterfaceEntity.UserInfo"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "InterfaceEntity.BattleType": {
            "type": "object",
            "properties": {
                "des": {
                    "type": "string"
                },
                "imgList": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "type": {
                    "type": "integer"
                }
            }
        },
        "InterfaceEntity.Score": {
            "type": "object",
            "properties": {
                "match": {
                    "type": "integer",
                    "example": 1
                },
                "score": {
                    "type": "integer",
                    "example": 100
                }
            }
        },
        "InterfaceEntity.UserImg": {
            "type": "object",
            "properties": {
                "chars": {
                    "type": "integer"
                },
                "score": {
                    "type": "integer"
                },
                "userIcon": {
                    "type": "string"
                },
                "userName": {
                    "type": "string"
                }
            }
        },
        "InterfaceEntity.UserInfo": {
            "type": "object",
            "properties": {
                "createTime": {
                    "type": "string"
                },
                "modifyTime": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "score": {
                    "type": "integer"
                },
                "target": {
                    "type": "integer"
                },
                "userIcon": {
                    "type": "string"
                },
                "userName": {
                    "type": "string"
                }
            }
        }
    }
}`

type swaggerInfo struct {
	Version     string
	Host        string
	BasePath    string
	Schemes     []string
	Title       string
	Description string
}

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = swaggerInfo{
	Version:     "",
	Host:        "",
	BasePath:    "",
	Schemes:     []string{},
	Title:       "",
	Description: "",
}

type s struct{}

func (s *s) ReadDoc() string {
	sInfo := SwaggerInfo
	sInfo.Description = strings.Replace(sInfo.Description, "\n", "\\n", -1)

	t, err := template.New("swagger_info").Funcs(template.FuncMap{
		"marshal": func(v interface{}) string {
			a, _ := json.Marshal(v)
			return string(a)
		},
	}).Parse(doc)
	if err != nil {
		return doc
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, sInfo); err != nil {
		return doc
	}

	return tpl.String()
}

func init() {
	swag.Register(swag.Name, &s{})
}

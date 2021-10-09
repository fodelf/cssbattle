/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-08-28 14:47:00
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-07 17:40:57
 */
package jwt

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/fodelf/cssbattle/models/InterfaceEntity"
)

//自定义Claims
type CustomClaims struct {
	UserName string
	UserId   string
	UserIcon string
	jwt.StandardClaims
}

const (
	SECRETKEY = "woshidashuaige" //私钥
)

// 生成token
func GenerateToken(user InterfaceEntity.UserInfo) (string, error) {
	maxAge := 60 * 60 * 24 * 7
	fmt.Println("userid", user.Id)
	customClaims := &CustomClaims{
		UserName: user.UserName, //用户姓名
		UserIcon: user.UserIcon,
		UserId:   user.Id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(maxAge) * time.Second).Unix(), // 过期时间，必须设置
			Issuer:    user.UserName,                                              // 非必须，也可以填充用户名，
		},
	}
	//采用HMAC SHA256加密算法
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, customClaims)
	tokenString, err := token.SignedString([]byte(SECRETKEY))
	if err != nil {
		return "", err
	} else {
		return tokenString, err
	}
}

//解析token
func ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SECRETKEY), nil
	})
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}

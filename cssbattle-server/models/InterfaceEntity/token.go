/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-08-31 09:06:37
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-08-31 09:12:22
 */
package InterfaceEntity

import "time"

//token 实体
type TokenInfo struct {
	Token      string    `json:"token"`
	ExpireDate time.Time `json:"expiredate"`
}

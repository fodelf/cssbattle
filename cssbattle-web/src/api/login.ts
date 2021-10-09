/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-09-12 11:11:36
 * @LastEditors: pym
 * @LastEditTime: 2021-09-12 11:44:34
 */
import request from '@/utils/request';

export const login = (params: Object) => {
  return request({
    url: '/api/v1/user/login',
    method: 'post',
    data: params
  })
}

export const register = (params: Object) => {
  return request({
    url: '/api/v1/user/register',
    method: 'post',
    data: params
  })
}

export const getUserInfo = (params: Object) => {
  return request({
    url: '/api/v1/user/getUser',
    method: 'post',
    data: params
  })
}
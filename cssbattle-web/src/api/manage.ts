/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-07 11:20:14
 * @LastEditors: pym
 * @LastEditTime: 2021-10-07 19:42:05
 */
import request from '@/utils/request';

export const getList = () => {
  return request({
    url: '/api/v1/audition/getAuditionList',
    method: 'post'
  })
}

export const createAudition = (params: Object) => {
  return request({
    url: '/api/v1/audition/create',
    method: 'post',
    data: params
  })
}

export const getAuditionCssList = (params: Object) => {
  return request({
    url: '/api/v1/audition/getAuditionCssList',
    method: 'post',
    data: params
  })
}

export const createCss = (params: Object) => {
  return request({
    url: '/api/v1/audition/createCss',
    method: 'post',
    data: params
  })
}

/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-07 19:42:34
 * @LastEditors: pym
 * @LastEditTime: 2021-10-07 21:03:57
 */
import request from '@/utils/request';

export const getAuditionDetail = (params: Object) => {
  return request({
    url: '/api/v1/audition/getAuditionDetail',
    method: 'post',
    data: params
  })
}

export const auditionIMGCompare = (params: Object) => {
  return request({
    url: '/api/v1/audition/auditionIMGCompare',
    method: 'post',
    data: params
  })
}

export const getAuditionIMGCompare = (params: Object) => {
  return request({
    url: '/api/v1/audition/getAuditionIMGCompare',
    method: 'post',
    data: params
  })
}
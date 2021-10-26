/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-07 19:42:34
 * @LastEditors: pym
 * @LastEditTime: 2021-10-24 17:19:14
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

export const setAudition = (params: Object) => {
  return request({
    url: '/api/v1/audition/startAudition',
    method: 'post',
    data: params
  })
}

export const auditionEnd = (params: Object) => {
  return request({
    url: '/api/v1/audition/endAudition',
    method: 'post',
    data: params
  })
}

export const exerciseSubmit = (params: Object) => {
  return request({
    url: '/api/v1/audition/exerciseSubmit',
    method: 'post',
    data: params
  })
}

export const getExerciseDetail = (params: Object) => {
  return request({
    url: '/api/v1/audition/getExerciseDetail',
    method: 'post',
    data: params
  })
}

export const updateAuditionInfo = (params: Object) => {
  return request({
    url: '/api/v1/audition/updateAuditionInfo',
    method: 'post',
    data: params
  })
}
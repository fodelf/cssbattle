/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-10-07 11:20:14
 * @LastEditors: pym
 * @LastEditTime: 2021-10-10 19:32:07
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

export const deleteAudition = (params: Object) => {
  return request({
    url: '/api/v1/audition/deleteAudition',
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

export const deleteCss = (params: Object) => {
  return request({
    url: '/api/v1/audition/deleteCSS',
    method: 'post',
    data: params
  })
}


export const createExercise = (params: Object) => {
  return request({
    url: '/api/v1/audition/createExercise',
    method: 'post',
    data: params
  })
}

export const getAuditionExerciseList = (params: Object) => {
  return request({
    url: '/api/v1/audition/getAuditionExerciseList',
    method: 'post',
    data: params
  })
}

export const getExerciseList = () => {
  return request({
    url: '/api/v1/audition/getExerciseList',
    method: 'post',
  })
}

export const deleteExercise = (params: Object) => {
  return request({
    url: '/api/v1/audition/deleteExercise',
    method: 'post',
    data: params
  })
}

export const createExerciseByLib = (params: Object) => {
  return request({
    url: '/api/v1/audition/createExerciseByLib',
    method: 'post',
    data: params
  })
}

export const getAuditionExerciseDetail = (params: Object) => {
  return request({
    url: '/api/v1/audition/getAuditionExerciseDetail',
    method: 'post',
    data: params
  })
}

export const updateExercise = (params: Object) => {
  return request({
    url: '/api/v1/audition/updateExercise',
    method: 'post',
    data: params
  })
}
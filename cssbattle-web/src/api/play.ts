/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-29 19:35:38
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-09-13 18:46:46
 */
import request from '@/utils/request';

export const upload = (params: Object) => {
  return request({
    url: '/api/v1/oss/upload',
    method: 'post',
    data: params,
  });
};

export const getImgDetail = (params: Object) => {
  return request({
    url: '/api/v1/img/getImgDetail',
    method: 'get',
    params,
  });
};

export const compare = (params: Object) => {
  return request({
    url: '/api/v1/img/imgCompare',
    method: 'post',
    data: params,
  });
};

export const getPlayRankList = (params: Object) => {
  return request({
    url: '/api/v1/sort/sortById',
    method: 'get',
    params,
  });
};
export const getUserImgDetail = (params: Object) => {
  return request({
    url: '/api/v1/img/getUserImgDetail',
    method: 'get',
    params,
  });
};

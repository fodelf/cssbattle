/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-09-05 11:30:04
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-10 10:29:59
 */
import request from '@/utils/request';

export const getImgList = (params: Object) => {
  return request({
    url: '/api/v1/img/getImgList',
    method: 'get',
    params,
  });
};

export const getBattleTypeList = () => {
  return request({
    url: '/api/v1/img/getCssbattleTypeList',
    method: 'get',
  });
};

export const getRankList = () => {
  return request({
    url: '/api/v1/user/sort',
    method: 'get',
  });
};

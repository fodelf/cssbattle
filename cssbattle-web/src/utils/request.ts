/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-08-29 19:33:21
 * @LastEditors: pym
 * @LastEditTime: 2021-09-12 11:38:46
 */
import { message } from 'antd';
import axios from 'axios';
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
//返回其他状态吗
axios.defaults.validateStatus = function (status: any) {
  return status >= 200 && status < 500; // 默认的
};

//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config: any) => {
  config.headers['token'] = localStorage.getItem('token')
  if(!config.url){
    return Promise.reject(new Error())
  }
  return config
}, (error: any) => {
  message.error('服务请求失败！');
  return Promise.reject(error)
});


//HTTPrequest拦截
axios.interceptors.response.use((config: any) => {
  return config;
}, (error: any) => {
  message.error('服务请求失败！');
  return Promise.reject(new Error(error));
})

export default axios;
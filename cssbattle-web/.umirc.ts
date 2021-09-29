/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-28 11:39:09
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-09-16 12:40:39
 */
import { defineConfig } from 'umi';
import routes from './src/router/index';

export default defineConfig({
  // favicon: '/favicon.ico',
  headScripts: [
    `var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?b5913322a5ed70356006c5938bfbdd4c";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();`,
  ],
  links: [
    {
      rel: 'icon',
      href:
        process.env.NODE_ENV === 'production'
          ? 'https://cdn.wuwenzhou.com.cn/web/0.0.8/'
          : '/favicon.ico',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  fastRefresh: {},
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://cdn.wuwenzhou.com.cn/web/0.0.8/'
      : '/',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:9527/', //代理的地址
      // pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
  },
});

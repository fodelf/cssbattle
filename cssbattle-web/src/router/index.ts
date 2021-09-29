/*
 * @Descripttion: 
 * @version: 
 * @Author: pym
 * @Date: 2021-09-05 10:38:23
 * @LastEditors: pym
 * @LastEditTime: 2021-09-14 16:42:53
 */
const routes =  [
  { 
    path: '/index', 
    component: '@/layouts/index',
    routes: [
      {
        path: '/index', 
        component: '@/pages/home/index',
      },
      { 
        path: '/index/learn', 
        component: '@/pages/learn/index',
      },
      { 
        path: '/index/play/:id', 
        component: '@/pages/play/index',
      },
      {
        path: '/index/login', 
        component: '@/pages/login/index',
      },
    ]
  },
  {
    path: '/',
    redirect: '/index'
  }
  // { path: '/user', component: '@/pages/user/index' },
]

export default routes
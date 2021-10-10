/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-09-05 10:38:23
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-09 21:56:36
 */
const routes = [
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
      {
        path: '/index/manage',
        component: '@/pages/manage/list',
        // redirect:'/index/manage/cssManage',
      },
      {
        path: '/index/detail/:id',
        component: '@/pages/manage/index',
        routes: [
          {
            path: 'cssManage',
            component: '@/pages/manage/children/cssManage/index',
          },
          {
            path: 'pratiseManage',
            component: '@/pages/manage/children/pratiseManage/index',
          },
          {
            path: 'addPratise',
            component: '@/pages/manage/children/addPratise/index',
          },
        ],
      },
      {
        path: '/index/audition/:id',
        component: '@/pages/audition/index',
      },
    ],
  },
  {
    path: '/',
    redirect: '/index',
  },
  // { path: '/user', component: '@/pages/user/index' },
];

export default routes;

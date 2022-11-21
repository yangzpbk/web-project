/*
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:24:34
 * @FilePath: \web-project\src\router\index.js
 */
import { createRouter, createWebHistory } from "vue-router";

/* Layout */
import Layout from '@/views/layout/Layout'

import routeCenterRoutes from './routeCenterRoutes';

/** 通用路由 */
export const constantRoutes = [
  {
    ...routeCenterRoutes
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: false,
    meta: { title: '首页', noCache: true, affix: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        hidden: false,
        meta: { title: '首页', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    meta: { title: '重定向', noCache: true, affix: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index'),
        meta: { title: '重定向', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true,
    meta: { title: '404', noCache: true, affix: true }
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true,
    meta: { title: '401', noCache: true, affix: true }
  }
];

// 异步路由
export const asyncRoutes = [];

const router = createRouter({
  mode: 'history',
  scrollBehavior() {
    return { y: 0 }
  },
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes.concat(asyncRoutes)
});

export default router;

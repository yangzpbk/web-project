import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

/* Layout */
import Layout from '@/views/layout/Layout'

import routeCenterRoutes from './routeCenterRoutes';

/** 通用路由 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  // {
  //   path: '/saleCenterDictMobileWeb/ssoLogin',
  //   redirect: '/ssoLogin',
  //   hidden: true
  // },
  {
    path: '/ssoLogin',
    component: () => import('@/views/login/ssoLogin'),
    hidden: true
  },
  // {
  //   path: '/oaDealTask',
  //   component: () => import('@/views/login/oaDealTask'),
  //   hidden: true
  // },
  // {
  //   path: '/toOtherSystem',
  //   component: () => import('@/views/redirect/toOtherSystem'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  // {
  //   path: '/ssoErr',
  //   component: () => import('@/views/errorPage/ssoErr'),
  //   hidden: true
  // },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '首页', noCache: true, affix: true }
      }
    ]
  },
  {
    ...routeCenterRoutes
  }
];

// 异步路由
export const asyncRoutes = [];


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

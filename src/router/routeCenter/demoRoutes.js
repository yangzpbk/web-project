/*
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:48:34
 * @FilePath: \web-project\src\router\routeCenter\demoRoutes.js
 */
import PlaceholderView from '@/views/compDisplay/placeholderView';

const demoRoutes = {
    path: 'demo',
    component: PlaceholderView,
    meta: { title: '路由测试', noCache: true },
    hidden: false,
    children: [
        {
            path: 'pageOne',
            component: () => import('@/views/routeCenter/demo/pageOne.vue'),
            name: 'pageOne',
            meta: { title: '测试页面1', noCache: true }
        },
        {
            path: 'pageTwo',
            component: () => import('@/views/routeCenter/demo/pageTwo.vue'),
            name: 'pageTwo',
            meta: { title: '测试页面2', noCache: true }
        },
        {
            path: 'pageThree',
            component: () => import('@/views/routeCenter/demo/pageThree.vue'),
            name: 'pageThree',
            meta: { title: '测试页面3', noCache: true }
        },
        {
            path: 'pageFour',
            component: () => import('@/views/routeCenter/demo/pageFour.vue'),
            name: 'pageFour',
            meta: { title: '测试页面4', noCache: true }
        },
    ]
};

export default demoRoutes;

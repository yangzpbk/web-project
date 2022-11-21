/*
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:48:34
 * @FilePath: \web-project\src\router\routeCenter\projectRoutes.js
 */
import PlaceholderView from '@/views/compDisplay/placeholderView';

const projectRoutes = {
  path: 'project',
  component: PlaceholderView,
  meta: { title: '项目管理', noCache: true },
  hidden: false,
  children: [
    {
      path: 'projectList',
      component: () => import('@/views/routeCenter/project/projectList.vue'),
      name: 'projectList',
      meta: { title: '项目管理列表', noCache: true }
    }
  ]
};

export default projectRoutes;

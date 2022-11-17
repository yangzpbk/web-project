/*
 * @Author: yangzp
 * @Description: 
 * @Date: 2022-11-17 16:45:05
 * @FilePath: \web-project\src\router\routeCenterRoutes.js
 */
import PlaceholderView from '@/views/compDisplay/placeholderView'
import projectRoutes from './routeCenter/projectRoutes';

const routeCenterRoutes = {
  path: '/routeCenter',
  component: PlaceholderView,
  meta: {
    title: '路由中心'
  },
  children: [
    {
      ...projectRoutes
    }
  ]
};

export default routeCenterRoutes;
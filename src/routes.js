import RouteMain from './routes/Main';
import RouteExam from './routes/Exam';
import RouteGroup from './routes/Group';
import RouteSearch from './routes/Search';

export default [
  { path: '/', component: RouteMain },
  { path: '/exam', component: RouteExam },
  { path: '/groups', redirect: '/groups/grade-1/1' },
  { path: '/groups/:id/:page', name: 'group', component: RouteGroup },
  { path: '/search/:term', name: 'search', component: RouteSearch }
]

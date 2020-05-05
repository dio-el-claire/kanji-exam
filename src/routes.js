import Main from './components/Main'
import Test from './components/Test'
import Group from './components/Group'
import Card from './components/Card'

export default [
  { path: '/', component: Main },
  { path: '/exam', component: Test },
  { path: '/groups', component: Group, redirect: '/groups/grade-1' },
  { path: '/groups/:id', name: 'group', component: Group },
  { path: '/groups/:groupId/:kanji', name: 'card', component: Card }
]

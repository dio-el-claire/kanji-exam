import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/groups',
    name: 'KanjiGroups',
    redirect: '/groups/grade-1/1'
  },
  {
    path: '/groups/:id/:page/:kanji?',
    name: 'KanjiGroup',
    component: () => import(/* webpackChunkName: "KanjiGroup" */ '../views/KahjiGroup.vue')
  },
  {
    path: '/exam',
    name: 'ExamSelector',
    component: () => import(/* webpackChunkName: "ExamSelector" */ '../views/ExamSelector.vue')
  },
  {
    path: '/exam/:id',
    name: 'Exam',
    component: () => import(/* webpackChunkName: "Exam" */ '../views/Exam.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import routes from './routes'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const router = new Router({
  routes,
  mode: 'history'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

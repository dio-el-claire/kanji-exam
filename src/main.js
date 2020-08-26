import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/fonts/stylesheet.css'
import './assets/styles/spinner.css'

Vue.use(Buefy)

Vue.config.productionTip = false

store.dispatch('LOAD_KANJI_GROUPS')

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

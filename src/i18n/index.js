import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enMessages from './en'
import ruMessages from './ru'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'ru', // set locale
  messages: {
    ru: { message: ruMessages },
    en: { message: enMessages }
  }
})

export default i18n

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const enMessages = {
  exploreKanji: 'Explore Kanji',
  about: 'About',
  langs: {
    ru: 'Russian',
    en: 'English'
  }
}

const ruMessages = {
  exploreKanji: 'Группы иероглифов',
  about: 'О проекте',
  langs: {
    ru: 'Русский',
    en: 'Английский'
  }
}

const i18n = new VueI18n({
  locale: 'ru', // set locale
  messages: {
    ru: { message: ruMessages },
    en: { message: enMessages }
  }
})

export default i18n

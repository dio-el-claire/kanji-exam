import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const enMessages = {
  exploreKanji: 'Explore Kanji',
  exam: 'Exam',
  about: 'About',
  langs: {
    ru: 'Russian',
    en: 'English'
  },
  meanings: 'Meanings',
  onReading: 'On-reading',
  kunReadings: 'Kun readings',
  nameReadings: 'Name Readings',
  JLPTLevel: 'JLPT Level',
  strokeCount: 'Stroke Count',
  unicode: 'Unicode',
  showWords: 'Show Words',
  hideWords: 'Hide words',
  selectGroupExam: 'Select group to start exam',
  configureExam: 'Configure random generated exam',
  examLevel: 'Level of Difficulty',
  kanjiNumber: 'Number of kanji',
  cancel: 'Cancel',
  startExam: 'Start Exam',
  loadingKanjiGroups: 'Loading Kanji Groups',
  or: 'Or'
}

const ruMessages = {
  exploreKanji: 'Группы иероглифов',
  exam: 'Пройти тест',
  about: 'О проекте',
  langs: {
    ru: 'Русский',
    en: 'Английский'
  },
  meanings: 'Значения',
  onReading: 'Онное чтение',
  kunReadings: 'Кунное чтение',
  nameReadings: 'Чтение в именах',
  JLPTLevel: 'Уровень JLPT',
  strokeCount: 'Количество строк',
  unicode: 'Символ юникода',
  showWords: 'Показать слова',
  hideWords: 'Скрыть слова',
  selectGroupExam: 'Выберите группу иероглифов для теста',
  configureExam: 'Сгененрируйте тест случайным образом',
  examLevel: 'Уровень сложности',
  kanjiNumber: 'Количество иероглифов',
  cancel: 'Отмена',
  startExam: 'Начать тест',
  loadingKanjiGroups: 'Загружаем группы иероглифов',
  or: 'или'
}

const i18n = new VueI18n({
  locale: 'ru', // set locale
  messages: {
    ru: { message: ruMessages },
    en: { message: enMessages }
  }
})

export default i18n

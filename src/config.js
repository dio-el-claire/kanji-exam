export default {
  BASE_URL: '',
  KANJI_PATH: 'kanji',
  READING_PATH: 'reading',
  WORDS_PATH: 'words',
  ITEMS_PER_PAGE: 20,
  DB_NAME: 'kanjiApp',
  DB_VERSION: 1,
  TYPES: {
    GROUP: { label: 'group', key: 'label', indexes: [{ name: 'label' }] },
    KANJI: { label: 'kanji', key: 'kanji', indexes: [
      { name: 'kanji' },
      { name: 'kun_readings', options: { multiEntry: true } },
      { name: 'on_readings', options: { multiEntry: true } }
    ] }
  }
}

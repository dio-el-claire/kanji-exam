export default {
  ITEMS_PER_PAGE: 15,
  DB_NAME: 'kanjiApp',
  DB_VERSION: 1,
  TYPES: {
    GROUP: { label: 'group', key: 'label', indexes: [{ name: 'label' }] },
    KANJI: { label: 'kanji', key: 'label', indexes: [
      { name: 'label' },
      { name: 'kun_readings', options: { multiEntry: true } },
      { name: 'on_readings', options: { multiEntry: true } }
    ] }
  }
}

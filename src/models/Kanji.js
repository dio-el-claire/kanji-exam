import { Model } from 'vue-mc'

export default class Kanji extends Model {
  loaded = false

  defaults() {
    return {
      kanji: '',
      grade: null,
      meanings: [],
      kun_readings: [],
      on_readings: [],
      name_readings: [],
      jlpt: null
    }
  }

  routes() {
    return {
      fetch: 'https://kanjiapi.dev/v1/kanji/{kanji}'
    }
  }

  options() {
    return {
      identifier: 'kanji'
    }
  }

  load() {
    if (!this.loaded) {
      this.fetch().finally(() => { this.loaded = true; });
    }

  }

  getMeaning() {
    return this.meanings[0];
  }

  getMeanings() {
    return this.meanings.join(', ');
  }
}

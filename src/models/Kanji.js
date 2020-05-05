import { Model } from 'vue-mc'

export default class Kanji extends Model {
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

  getMeaning() {
    return this.meanings[0];
  }

  getMeanings() {
    return this.meanings.join(', ');
  }
}

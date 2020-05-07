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
      jlpt: null,
      stroke_count: null,
      unicode: null
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
      this.fetch().finally(() => {
        this.loaded = true;
        this.emit('loaded');
      });
    }
  }

  serialize() {
    const data = { loaded: this.loaded };
    Object.keys(this.defaults()).forEach(attr => {
      data[attr] = this[attr];
    });
    return data;
  }

  materialize(data) {
    this.loaded = data.loaded;
    Object.keys(this.defaults()).forEach(attr => {
      this[attr] = data[attr];
    });
  }

  getMeaning() {
    return this.meanings[0];
  }

  getMeanings() {
    return this.meanings.join(', ');
  }
}

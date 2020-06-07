import CONFIG from '../config';
import cache from '../cache';

export default class Kanji {
  kanji = ''
  grade = null
  meanings = []
  kun_readings = []
  on_readings = []

  attrs = {
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

  constructor(kanji) {
    this.kanji = kanji;
  }

  attrAsString(attr, clue = ', ') {
    return Array.isArray(this[attr]) ? this[attr].join(clue) : '';
  }

  materialize(data) {
    Object.keys(this.attrs).forEach(attr => {
      this[attr] = data[attr] || this.attrs[attr];
    });
    return this;
  }

  serialize() {
    const data = { };
    Object.keys(this.attrs).forEach(attr => {
      data[attr] = this[attr];
    });
    return data;
  }

  async fetch() {
    const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.kanji}`;
    const response = await fetch(url);
    const data = await response.json();
    this.materialize(data);
    cache.putKanji(this.serialize());
    return Promise.resolve(this);
  }

  async load() {
    if (this.meanings.length) {
      return Promise.resolve(this);
    }
    let data = await cache.getKanji(this.kanji);
    if (data) {
      return Promise.resolve(this.materialize(data));
    }
    return this.fetch();
  }

  static async find(symbol) {
    const kanji = new Kanji(symbol);

    let data = await cache.getKanji(symbol);
    if (data) {
      kanji.materialize(data);
    } else {
      kanji.fetch();
    }
    return Promise.resolve(kanji);
  }
}

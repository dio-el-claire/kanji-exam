import CONFIG from '../config';

class Evented {

  #listeners = []

  on(event, listener) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(listener);
    // console.log('on', this.#listeners[event])
  }

  off(event, listener) {
    const listeners = this.#listeners[event] || [];
    const ndx = listeners.indexOf(listener);
    if (ndx !== -1) {
      listeners.splice(ndx, 1);
      console.log('off', listeners)
    }
  }

  once(event, listener) {
    const fn = (...args) => {
      listener(args);
      this.off(event, fn);
    }
    this.on(event, fn);
  }

  emit(event, ...data) {
    const listeners = this.#listeners[event] || [];

    listeners.forEach(listener => {
      listener(data);
    });
  }
}


export default class Kanji extends Evented {
  loaded = false
  loading = false
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
    super();
    this.kanji = kanji;
  }

  attrAsString(attr, clue = ', ') {
    return Array.isArray(this[attr]) ? this[attr].join(clue) : '';
  }

  materialize(data) {
    Object.keys(this.attrs).forEach(attr => {
      this[attr] = data[attr] || this.attrs[attr];
    });
    this.loaded = !!this.meanings.length;
  }

  serialize() {
    const data = { loaded: this.loaded };
    Object.keys(this.attrs).forEach(attr => {
      data[attr] = this[attr];
    });
    return data;
  }

  async fetch() {
    this.loading = true;
    const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.kanji}`;
    const response = await fetch(url);
    const data = await response.json();
    this.materialize(data);
    this.loading = false;
    return Promise.resolve(this);
  }

}

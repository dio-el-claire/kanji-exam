import { Collection } from 'vue-mc'
import Kanji from './Kanji'
import cache from '../cache';
import CONFIG from '../config';

export default class KanjiGroup {
  label = ''

  loaded = false

  models = []

  error = null

  serialize() {
    return {
      label: this.label,
      loaded: this.loaded,
      models: this.models.map(model => model.kanji || model)
    };
  }

  materialize(data) {
    const { label, loaded, models } = data;

    this.label = label;
    this.loaded = loaded;
    this.models = models;
  }

  async loadKanjies() {
    const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.label}`;
    try {
      const data = await fetch(url);
    } catch (e) {
      this.error = e.message;
      return Promise.reject(e);
    }
    this.models = data.json();
    return Promise.resolve();
  }
}

class _KanjiGroup extends Collection {
  label = ''

  loaded = false

  _cache = {}

  _modelIds = []

  count = 0

  error = null

  constructor(label, models, options, attributes) {
    super(models, options, attributes)
    this.label = label
  }

  options() {
    return {
      model: Kanji
    }
  }

  routes() {
    return {
      fetch: 'https://kanjiapi.dev/v1/kanji/'
    }
  }

  async fetch() {
    if (!this.loaded) {
      const path = this.label.indexOf('jlpt') === 0 ? 'all' : this.label;
      const config = {
        url: `${this.getFetchRoute()}${path}`,
        method: 'GET'
      }

      this.loading = true;

      let response;

      try {
        response = await this.createRequest(config).send();
        this._addModels(response.getData());
        this.loaded = true;
      } catch (e) {
        this.error = e.message;
        this.loading = false;
        return Promise.reject(e);
      }
    }
    return Promise.resolve(this.models)
  }

  serialize() {
    const { label, loaded } = this;
    return {
      label,
      loaded,
      models: this.models.map(model => model.kanji)
    };
  }

  materialize(data) {
    const { label, loaded, models } = data;

    this.label = label;
    this.loaded = loaded;
    this._modelIds = models;
    this.count = models.length;
  }

  _addModels(ids) {
    this.add(ids.map(id => {
      const model = new Kanji({ kanji: id });
      model.on('loaded', () => {
        cache.putKanji(model.serialize());
      });
      return model;
    }));
    this.count = this.models.length;
  }

  getModels(start, end) {
    const key = `${start}-${end}`;
    if (!this._cache[key]) {
      if (!this.models.length) {
        this._addModels(this._modelIds)
      }
      this._cache[key] = this.models.slice(start, end).map(model => {
        cache.getKanji(model.kanji).then(data => {
          if(data) {
            model.materialize(data);
          } else {
            model.load();
          }
        });
        return model;
      });
    }
    return this._cache[key];
  }

  findKanji(kanji) {
    return this.models.find(model => model.kanji === kanji);
  }

}

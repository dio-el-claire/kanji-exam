import { Collection } from 'vue-mc'
import Kanji from './Kanji'
import cache from '../cache';

export default class KanjiGroup extends Collection {
  label = ''

  loaded = false

  _cache = {}

  _modelIds = []

  count = 0

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

  fetch() {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        return resolve(this.models);
      }
      // @todo jlpt
      const config = {
        url: `${this.getFetchRoute()}${this.label}`,
        method: 'GET'
      }

      this.loading = true

      this.createRequest(config)
        .send()
        .then(response => {
          if (!this.loaded) {
            // group can be restored from cache
            this._addModels(response.getData());
            this.loaded = true
          }
          resolve(this.models)
        })
        .catch(reject)
        .finally(() => {
          this.loading = false
        })
    })
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
        }).catch(() => {
          model.load();
        })

        return model;
      });
    }
    return this._cache[key];
  }

  findKanji(kanji) {
    return this.models.find(model => model.kanji === kanji);
  }

}

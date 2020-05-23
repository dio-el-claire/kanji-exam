import Kanji from './Kanji'
import cache from '../cache';
import CONFIG from '../config';

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export default class KanjiGroup {
  label = ''

  name = ''

  loaded = false

  custom = false

  models = []

  error = null

  constructor(label) {
    this.label = label;
    this.name = capitalize(label).replace('-', ' ');
    this.load();
  }

  serialize() {
    const { label, loaded, custom, models = [] } = this;
    return {
      label,
      loaded,
      custom,
      models: models.map(model => model.kanji || model)
    };
  }

  materialize(data) {
    const { label, custom, models = [] } = data;
    this.label = label;
    this.custom = custom;
    this.setModels(models);
  }

  async load() {
    await cache.init();

    const data = await cache.getGroup(this.label);

    if (data) {
      this.materialize(data);
    } else {
      await this.fetchKanji();
      cache.putGroup(this.serialize());
    }
  }

  async fetchKanji() {
    var data;

    if (this.label.indexOf('jlpt-') === 0) {
      data = CONFIG[this.label.toUpperCase()];
    } else {
      const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.label}`;

      try {
        const response = await fetch(url);
        data = await response.json();
      } catch (e) {
        this.error = e.message;
        return Promise.resolve();
      }
    }

    this.setModels(data);
    return Promise.resolve();
  }

  setModels(models) {
    this.models = models.map(kanji => new Kanji(kanji));
    this.loaded = !!models.length;
    this.count = models.length;
  }

  slice(start, end) {
    const models = this.models.slice(start, end).map(model => {
      if (!model.loaded && !model.loading) {
        this.loadModel(model);
      }
      return model;
    });

    return  models;
  }

  indexOf(model) {
    return this.models.indexOf(model);
  }

  async loadModel(model) {
    model.loading = true;
    const data = await cache.getKanji(model.kanji);
    if (data) {
      return model.materialize(data);
    }
    await model.fetch();
    cache.putKanji(model);
  }
}

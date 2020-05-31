import Kanji from './Kanji'
import cache from '../cache';
import CONFIG from '../config';


export default class KanjiGroup {
  label = ''

  name = ''

  loaded = false

  custom = false

  models = []

  count = 0

  error = null

  constructor(data = {}) {
    this.materialize(data);
  }

  serialize() {
    const { label, name, loaded, custom, models = [] } = this;
    return {
      label,
      name,
      loaded,
      custom,
      models: models.map(model => model.kanji || model)
    };
  }

  materialize(data) {
    const { label, name, custom, models = [] } = data;
    this.label = label;
    this.name = name;
    this.custom = !!custom;
    if (models.length) {
      this.setModels(models);
    } else if (!this.custom) {
      this.fetchModels();
    }
  }

  async fetchModels() {
    var data;

    if (this.label.indexOf('jlpt-') === 0) {
      data = CONFIG[this.label.toUpperCase()];
    } else {
      const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.label}`;

      try {
        const response = await fetch(url);
        data = await response.json();
      } catch (e) {
        return this.error = e.message;
      }
    }

    this.setModels(data);
    this.save();
  }

  setModels(models) {
    this.models = models.map(kanji => new Kanji(kanji));
    this.updateCount();
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
    const _model = this.models.find(m => m.kanji === model.kanji);
    return this.models.indexOf(_model);
  }

  findKanji(sign) {
    return this.models.find(kanji => kanji.kanji === sign);
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

  addModels(models) {
    models.forEach(model => {
      if (this.indexOf(model) === -1) {
        this.models.push(model);
      }
    });
    this.updateCount();
    this.save();
  }

  deleteModel(model) {
    const ndx = this.indexOf(model);
    if (ndx !== -1) {
      this.models.splice(ndx, 1);
      this.updateCount();
      this.save();
    }
  }

  updateCount() {
    this.count = this.models.length;
  }

  save() {
    cache.putGroup(this.serialize());
  }
}

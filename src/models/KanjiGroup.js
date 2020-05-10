import Kanji from './Kanji'
import cache from '../cache';
import CONFIG from '../config';

export default class KanjiGroup {
  label = ''

  loaded = false

  custom = false

  models = []

  error = null

  constructor(label) {
    this.label = label;
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
    if (this.label.indexOf('jlpt-') === -1) {
      const url = `${CONFIG.BASE_URL}/${CONFIG.KANJI_PATH}/${this.label}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.setModels(data);
        return Promise.resolve();
      } catch (e) {
        this.error = e.message;
        return Promise.resolve([]);
      }
    }
  }

  setModels(models) {
    this.models = models;
    this.loaded = !!models.length;
    this.count = models.length;
  }

  slice(start, end) {
    // console.log(this.models)
    const models = this.models.slice(start, end).map(model => {
      // console.log(model, typeof model)
      if (typeof model === 'string') {
        const ndx = this.models.indexOf(model);
        model = new Kanji(model);
        this.models[ndx] = model;
        // console.log(this.models[ndx])
      }
      if (!model.loaded) {
        cache.getKanji(model.kanji).then(data => {
          if (data) {

            model.materialize(data);
          } else {
            model.fetch().then(() => {
              console.log('putKanji', model)
              cache.putKanji(model);
            });
          }
        });
      }
      return model;
    });
    console.log(models)

    return  models;
  }
}

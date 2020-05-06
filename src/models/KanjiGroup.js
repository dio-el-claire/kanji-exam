import { Collection } from 'vue-mc'
import Kanji from './Kanji'
import CONFIG from '../config';

export default class KanjiGroup extends Collection {
  label = ''

  loaded = false

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

      const config = {
        url: `${this.getFetchRoute()}${this.label}`,
        method: 'GET'
      }

      this.loading = true

      this.createRequest(config)
        .send()
        .then(response => {
          this.add(response.getData().map(id => new Kanji({ kanji: id })));
          // response.getData().forEach(id => {
          //   this.add(new Kanji({ kanji: id }));
          // });
          this.loaded = true
          resolve(this.models)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          this.loading = false
        })
    })

  }

  getPage(page) {
    page = parseInt(page);
    console.log('getPage', page)
    if (!(Number.isInteger(page) && page > 0)) {
      return [];
    }
    const limit = CONFIG.ITEMS_PER_PAGE;
    const offset = limit * (page - 1);
    return this.models.slice(offset, offset + limit).map(model => {
      model.load();
      return model;
    });
  }

  findKanji(kanji) {
    return this.models.find(model => model.kanji === kanji);
  }

}

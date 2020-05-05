import { Collection } from 'vue-mc'
import Kanji from './Kanji'

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
          response.getData().forEach(id => {
            const kanji = new Kanji({ kanji: id })
            kanji.fetch()
            this.add(kanji)
          });
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

  findKanji(kanji) {
    return this.models.find(model => model.kanji === kanji);
  }

  fetchGrade(grade) {
    const config = {
      url: `https://kanjiapi.dev/v1/kanji/grade-${grade}`,
      method: 'GET'
    }

    return this.createRequest(config)
              .send()
              .then(response => {
                response.getData().forEach(k => {
                  this.createRequest({url: `https://kanjiapi.dev/v1/kanji/${k}`, method: 'GET'}).send().then(resp => {
                    console.log(resp.getData())
                    this.add(resp.getData())
                    console.log(this.length)
                  })
                })
              })
  }
}

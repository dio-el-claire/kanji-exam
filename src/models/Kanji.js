import store from '@/store'
import { camelCase } from 'lodash'
import cacheDb from '@/cacheDb'
import { BASE_URL, KANJI_PATH } from '@/config'

class Kanji {
  sign = ''
  grade = null
  meanings = []
  kunReadings = []
  onReadings = []
  nameReadings = []
  jlpt = null
  strokeCount = null
  unicode = null

  static attrs = {
    sign: '',
    grade: '',
    meanings: '',
    kun_readings: '',
    on_readings: '',
    name_readings: '',
    jlpt: '',
    stroke_count: '',
    unicode: ''
  }

  static async loadAllKanjies() {
    await cacheDb.ready()
    let kanjies = await cacheDb.getAllKanjies()
    if (!kanjies.length) {
      const url = `${BASE_URL}/${KANJI_PATH}/all`
      try {
        const response = await fetch(url)
        const signs = await response.json()

        kanjies = signs.map(sign => Object.assign({}, Kanji.attrs, { sign }))
        cacheDb.putAllKanjies(kanjies)
      } catch (e) {
        alert(e.message)
      }
    }
    return kanjies.map(k => new Kanji(k))
  }

  serialize () {
    return Object.keys(Kanji.attrs).reduce((acc, key) => {
      acc[key] = this[camelCase(key)]
      return acc
    }, {})
  }

  materialize (data) {
    Object.keys(Kanji.attrs).forEach(key => {
      this[camelCase(key)] = data[key]
    })
  }

  async load() {
    const url = `${BASE_URL}/${KANJI_PATH}/${this.sign}`
    const response = await fetch(url)
    const data = await response.json()
    data.sign = data.kanji
    this.materialize(data)
    cacheDb.putKanji(this.serialize())
  }

  constructor (data) {
    this.materialize(data)
  }
}

Object.defineProperty(Kanji.prototype, 'isLoaded', {
  get() {
    if (!this.meanings) {
      this.load()
    }
    return !!this.meanings
  },
  set() { }
})

Object.assign(Kanji.prototype, { store })

export default Kanji

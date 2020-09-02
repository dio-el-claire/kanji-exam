import { DB_NAME, DB_VERSION, TYPES } from './config'
import { openDB } from 'idb'

class Cache {
  name = DB_NAME

  version = DB_VERSION

  types = TYPES

  db = null

  _promise = null

  async init () {
    if (!this._promise) {
      this._promise = openDB(this.name, this.version, {
        upgrade: (db) => {
          this.initDB(db)
        },
        blocked () {
          alert('Please, close this page in other tabs')
        },
        blocking () {
          alert('Newer version available. Reload page to update')
        }
      })

      this.db = await this._promise
    }
    return this._promise
  }

  ready () {
    return this.init()
  }

  initDB (db) {
    Object.keys(this.types).forEach(type => {
      const label = this.types[type].label
      if (!db.objectStoreNames.contains(label)) {
        const objStore = db.createObjectStore(label, { keyPath: this.types[type].key })
        this.types[type].indexes.forEach(ndx => {
          objStore.createIndex(ndx.name, ndx.name, ndx.options)
        })
      }
    })
  }

  async getAllKanjies () {
    const kanjies = await this.db.getAll(this.types.KANJI.label)
    return kanjies
  }

  async getKanji(id) {
    const kanji = await this.db.get(this.types.KANJI.label, id)
    return kanji
  }

  async putKanji (data) {
    return this.db.put(this.types.KANJI.label, data)
  }

  async putAllKanjies (kanjies) {
    return Promise.all(kanjies.map(k => this.putKanji(k)))
  }

  async getGroups () {
    const groups = await this.db.getAll(this.types.GROUP.label)
    return groups
  }

  async putGroup (data) {
    return this.db.put(this.types.GROUP.label, data)
  }

  async putAllGroups (groups) {
    return Promise.all(groups.map(g => this.putGroup(g)))
  }

  async getExamConfig () {
    const configs = await this.db.getAll(this.types.EXAM_CONFIG.label)
    return configs.length ? configs[0] : null
  }

  async putExamConfig(data) {
    return this.db.put(this.types.EXAM_CONFIG.label, data)
  }

  async getExam () {
    const exams = await this.db.getAll(this.types.EXAM.label)
    return exams.length ? exams[0] : null
  }

  async putExam(data) {
    return this.db.put(this.types.EXAM.label, data)
  }

  async clearExam() {
    return Promise.all([
      this.db.clear(this.types.EXAM_CONFIG.label),
      this.db.clear(this.types.EXAM.label)
    ])
  }

  async putStat(data) {
    return this.db.put(this.types.STAT.label, data)
  }

  async getAllStat () {
    const stat = await this.db.getAll(this.types.STAT.label)
    return stat
  }
}

export default new Cache()

import { DB_NAME, DB_VERSION, TYPES } from './config'
import { openDB } from 'idb'

class Cache {
  name = DB_NAME

  version = DB_VERSION

  types = TYPES

  db = null

  _promise = null

  saveAllKanjiesPromise = new Promise((resolve) => { })

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
      if (db.objectStoreNames.contains(label)) {
        db.deleteObjectStore(label)
      }

      const objStore = db.createObjectStore(label, { keyPath: this.types[type].key })
      this.types[type].indexes.forEach(ndx => {
        objStore.createIndex(ndx.name, ndx.name, ndx.options)
      })
    })
  }

  async getAllKanjies () {
    const kanjies = await this.db.getAll(this.types.KANJI.label)
    console.log('getAllKanjies')
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
    this.saveAllKanjiesPromise = Promise.all(kanjies.map(k => this.putKanji(k)))
    console.log('putAllKanjies')
    return this.saveAllKanjiesPromise
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

  async getExamConfigs () {
    const configs = await this.db.getAll(this.types.EXAM.label)
    return configs
  }

  async putExamConfig(data) {
    return this.db.put(this.types.EXAM.label, data)
  }
}

export default new Cache()

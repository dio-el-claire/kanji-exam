import CONFIG from './config';
import { openDB } from 'idb';

class Cache {
  name = CONFIG.DB_NAME

  version = CONFIG.DB_VERSION

  types = CONFIG.TYPES

  db = null

  async init() {
    const db = await openDB(this.name, this.version, {
      upgrade: (db) => {
        this.initDB(db);
      },
      blocked() {
        alert('Please, close this page in other tabs');
      },
      blocking() {
        alert('Newer version available. Reload page to update');
      }
    });

    this.db = db;
    return Promise.resolve();
  }

  initDB(db) {
    Object.keys(this.types).forEach(type => {
      const label = this.types[type].label;
      if (db.objectStoreNames.contains(label)) {
        db.deleteObjectStore(label);
      }

      let objStore = db.createObjectStore(label, { keyPath: this.types[type].key });
      this.types[type].indexes.forEach(ndx => {
        objStore.createIndex(ndx.name, ndx.name, ndx.options);
      });
    })
  }

  async getGroups() {
    const groups = await this.db.getAll(this.types.GROUP.label);
    return Promise.resolve(groups);
  }

  async getKanji(id) {
    const kanji = await this.db.get(this.types.KANJI.label, id);
    return Promise.resolve(kanji);
  }

  async putGroup(data) {
    await this.db.put(this.types.GROUP.label, data);
  }

  async putKanji(data) {
    await this.db.put(this.types.KANJI.label, data);
  }
}

export default new Cache();

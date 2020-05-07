import CONFIG from './config';

class Cache {
  // indexedDB = window.indexedDB

  name = CONFIG.DB_NAME

  version = CONFIG.DB_VERSION

  types = CONFIG.TYPES

  db = null

  init() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject('indexedDB does not supported');
      }
      const request = window.indexedDB.open(this.name, this.version);

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      }
      request.onerror = (e) => {
        console.log('onerror', e)
        reject(e);
      }
      request.onupgradeneeded = (e) => {
        console.log('onupgradeneeded', e)
        const db = e.target.result;
        console.log(db.version)
        this.initDB(db);
      }
    });
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

  getGroups() {
    return new Promise((resolve, reject) => {
      const type = this.types.GROUP.label;
      const request = this.db.transaction(type).objectStore(type).getAll();
      request.onsuccess = e => { resolve(e.target.result); };
      request.onerror = () => { reject(); };
    });
  }

  getKanji(id) {
    return new Promise((resolve, reject) => {
      const type = this.types.KANJI.label;
      const request = this.db.transaction(type).objectStore(type).get(id);
      request.onsuccess = e => { resolve(e.target.result); };
      request.onerror = () => { reject(); };
    });
  }

  putGroup(data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject();
      }
      const type = this.types.GROUP.label;
      const request = this.db.transaction(type, 'readwrite').objectStore(type).put(data);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  putKanji(data) {
    return new Promise((resolve, reject) => {
      const type = this.types.KANJI.label;
      const request = this.db.transaction(type, 'readwrite').objectStore(type).put(data);
      request.onsuccess = resolve;
      request.onerror = reject;
    })
  }
}

export default new Cache();

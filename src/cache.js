import CONFIG from './config';

// window.onload = function() {
//   window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//   window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
//   window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// }

class Cache {
  indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

  name = CONFIG.DB_NAME

  version = CONFIG.DB_VERSION

  types = CONFIG.TYPES

  constructor() {
    this.openRequest = this.indexedDB.open(this.name, this.version);

    this.openRequest.onsuccess = (e) => {
      console.log('onsuccess', e)
    }
    this.openRequest.onerror = (e) => {
      console.log('onerror', e)
    }
    this.openRequest.onupgradeneeded = (e) => {
      console.log('onupgradeneeded', e)
      const db = e.target.result;
      console.log(db.version)
      this.initDB(db);
    }

  }

  initDB(db) {
    Object.keys(this.types).forEach(type => {
      console.log('->', db)
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
    return [];
  }
}

export default new Cache();

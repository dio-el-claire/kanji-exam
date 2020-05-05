import KanjiGroup from './KanjiGroup'

class KanjiCollection {
  groups = []

  constructor() {
    this.groups= [1, 2, 3, 4, 5, 6, 8, 'all'].map(key => {
      let label = key > 0 ? `grade-${key}` : key;
      return { label, collection: new KanjiGroup(label) }
    })
    this._groupsMap = {}
    this.groups.forEach(group => {
      this._groupsMap[group.label] = group;
    })
  }

  getGroup(label) {
    const group = this._groupsMap[label]
    if (!group) {
      throw new Error(`Invalid kanji group label "${label}"`)
    }
    this.loadGroup(group);
    return group;
  }

  loadGroup(group) {
    return new Promise((resolve, reject) => {

      if (!group) {
        return reject(`group required`)
      }

      const collection = group.collection;

      if (collection.loaded) {
        return resolve(group);
      }

      const promise = collection.fetch()

      promise.then(models => {
        resolve(group)

        if (group.label === 'all') {
          console.log('from all')
          models.filter(model => model.grade).forEach(model => {
            let label = `grade-${model.grade}`;
            this._groupsMap[label].collection.add(model);
          })
        } else {
          console.log('to all')
          this._groupsMap.all.collection.add(models)
        }
      })
      return promise;
    })
  }
}

export default new KanjiCollection()

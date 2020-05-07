import KanjiGroup from './KanjiGroup'
import cache from '../cache';

const labels = [];
let i = 0;
while(++i <= 10) {
  if (i !== 7) {
    labels.push(`grade-${i}`);
  }
}

i = 0;
while (++i <= 5) {
  labels.push(`jlpt-${i}`);
}
labels.push('joyo');
labels.push('jinmeiyo');
labels.push('all');

class KanjiCollection {
  groups = []

  #groupsMap = {}

  constructor() {
    this._initGroups();
    this._init();
  }

  _init() {
    return new Promise(resolve => {
      cache.init().then(() => {
        cache.getGroups().then(groups => {
          groups.forEach(data => {
            this.#groupsMap[data.label].materialize(data);
          });
          resolve();
        });
      })
    });
  }

  _initGroups() {
    this.groups= labels.map(label => {
      const group = new KanjiGroup(label);
      return this.#groupsMap[label] = group;
    })
  }

  getGroup(label) {
    const group = this.#groupsMap[label]
    if (!group) {
      throw new Error(`Invalid kanji group label "${label}"`)
    }
    this.loadGroup(group);
    return group;
  }

  loadGroup(group) {
    if (group.loaded) {
      return;
    }

    this._init().then(() => {
      if (group.loaded) {
        return;
      }
      group.fetch().then(models => {

        cache.putGroup(group.serialize());

        if (group.label === 'all') {
          console.log(models)
          // @todo
          // models.filter(model => model.grade).forEach(model => {
          //   let label = `grade-${model.grade}`;
          //   this.#groupsMap[label].add(model);
          // })
        }
      });
    });

  }
}

export default new KanjiCollection()

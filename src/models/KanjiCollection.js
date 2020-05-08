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

  async _init() {
    await cache.init();
    const groups = await cache.getGroups();
    groups.forEach(data => {
      this.#groupsMap[data.label].materialize(data);
    });
    return Promise.resolve();
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

  async loadGroup(group) {
    await this._init();

    if (group.loaded) {
      return;
    }

    try {
      const models = await group.fetch();
      cache.putGroup(group.serialize());
      if (group.label === 'all') {
        console.log(models)
        // @todo
        // models.filter(model => model.grade).forEach(model => {
        //   let label = `grade-${model.grade}`;
        //   this.#groupsMap[label].add(model);
        // })
      }
    } catch(e) {
      console.warn(e);
    }

  }
}

export default new KanjiCollection()

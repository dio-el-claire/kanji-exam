import KanjiGroup from './KanjiGroup'
import cache from '../cache';

class KanjiCollection {
  groups = []

  _groupsMap = {}

  constructor() {
    cache.getGroups();
    
    this.groups= [1, 2, 3, 4, 5, 6, 8, 'joyo', 'jinmeiyo', 'all'].map(key => {
      let label = key > 0 ? `grade-${key}` : key;
      const group = new KanjiGroup(label);
      this._groupsMap[label] = group;
      return group;
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
    if (!group) {
      throw new Error('Group required');
    }
    if (group.loaded) {
      return;
    }

    group.fetch().then(models => {
      if (group.label === 'all') {
        console.log('from all')
        models.filter(model => model.grade).forEach(model => {
          let label = `grade-${model.grade}`;
          this._groupsMap[label].add(model);
        })
      } else {
        console.log('to all')
        this._groupsMap.all.add(models)
      }
    })
  }
}

export default new KanjiCollection()

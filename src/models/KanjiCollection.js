import { v4 as uuidv4 } from 'uuid';
import KanjiGroup from './KanjiGroup'
import Kanji from './Kanji'
import cache from '../cache';

const labels = [];
[...Array(8).keys()].forEach(i => { ++i !== 7 && labels.push(`grade-${i}`); });
[...Array(5).keys()].forEach(i => labels.push(`jlpt-${++i}`));

labels.push('joyo');
labels.push('jinmeiyo');
labels.push('all');

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}


class KanjiCollection {
  groups = []

  constructor() {
    this.init();
  }

  async init() {
    const loaded = await this.loadGroups();
    if (!loaded) {
      this.createGroups();
    }
  }

  async findKanji(symbol) {
    const kanji = new Kanji(symbol);

    let data = await cache.getKanji(symbol);
    if (data) {
      kanji.materialize(data);
    } else {
      kanji.fetch();
    }
    return Promise.resolve(kanji);
  }

  async loadGroups() {
    await cache.init();

    const data = await cache.getGroups();
    if (data) {
      data.forEach(item => {
        this.groups.push(new KanjiGroup(item));
      });
    }
    return !!this.groups.length;
  }

  createGroups() {
    let labels = [];
    [...Array(8).keys()].forEach(i => { ++i !== 7 && labels.push(`grade-${i}`); });
    [...Array(5).keys()].forEach(i => labels.push(`jlpt-${++i}`));

    labels.concat(['joyo', 'jinmeiyo', 'all']).forEach(label => {
      const name = capitalize(label).replace('-', ' ');
      this.groups.push(new KanjiGroup({ label, name, custom: false }));
    });
  }

  createCustomGroup(name) {
    const group = new KanjiGroup({
      label: uuidv4(),
      name,
      custom: true,
      loaded: true
    });
    this.groups.push(group);
    cache.putGroup(group);
  }

  deleteCustomGroup(group) {
    if (group.custom) {
      this.groups.splice(this.groups.indexOf(group), 1);
      cache.deleteGroup(group.label);
    }
  }

}

export default new KanjiCollection();

import KanjiGroup from './KanjiGroup'
import Kanji from './Kanji'
import cache from '../cache';

const labels = [];
[...Array(8).keys()].forEach(i => { ++i !== 7 && labels.push(`grade-${i}`); });
[...Array(5).keys()].forEach(i => labels.push(`jlpt-${++i}`));

labels.push('joyo');
labels.push('jinmeiyo');
labels.push('all');

class KanjiCollection {
  groups = []

  #groupsMap = {}

  constructor() {
    this.groups= labels.map(label => {
      const group = new KanjiGroup(label);
      return this.#groupsMap[label] = group;
    });
  }

  getGroup(label) {
    const group = this.#groupsMap[label]
    if (!group) {
      throw new Error(`Invalid kanji group label "${label}"`);
    }

    return group;
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

}

export default new KanjiCollection()

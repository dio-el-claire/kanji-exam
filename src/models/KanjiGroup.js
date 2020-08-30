import cacheDb from '@/cacheDb'
import { capitalize } from 'lodash'
import Kanji from '@/models/Kanji'
import { JLPT, BASE_URL, KANJI_PATH } from '@/config'

function sortGroups(g1, g2) {
  if (g1.custom && !g2.custom) {
    return 1
  }
  if (!g1.custom && g2.custom) {
    return -1
  }
  if (g1.custom && g2.custom) {
    return g1.label.localeCompare(g2.label)
  }
  if (!g1.custom && !g2.custom) {
    return g1.sortNdx < g2.sortNdx ? -1 : 1
  }
}

class KanjiGroup {
  // store
  id = null
  label = ''
  custom = false
  kanjies = []
  kanjiIds = []

  static attrs = {
    id: null,
    label: '',
    custom: false,
    kanjies: [],
    kanjiIds: [],
    sortNdx: null
  }

  static groupsConf = [
    { id: 'grade-1', sortNdx: 1 },
    { id: 'grade-2', sortNdx: 2 },
    { id: 'grade-3', sortNdx: 3 },
    { id: 'grade-4', sortNdx: 4 },
    { id: 'grade-5', sortNdx: 5 },
    { id: 'grade-6', sortNdx: 6 },
    { id: 'grade-8', sortNdx: 7 },
    { id: 'jlpt-5', sortNdx: 8, kanjiIds: JLPT['JLPT-5'] },
    { id: 'jlpt-4', sortNdx: 9, kanjiIds: JLPT['JLPT-4'] },
    { id: 'jlpt-3', sortNdx: 10, kanjiIds: JLPT['JLPT-3'] },
    { id: 'jlpt-2', sortNdx: 11, kanjiIds: JLPT['JLPT-2'] },
    { id: 'jlpt-1', sortNdx: 12, kanjiIds: JLPT['JLPT-1'] },
    { id: 'joyo', sortNdx: 13 },
    { id: 'jinmeiyo', sortNdx: 14 },
    { id: 'all', sortNdx: 15 },
    { id: 'custom1', label: 'custom1', custom: true, kanjiIds: JLPT['JLPT-5'] },
    { id: 'custom2', label: 'available', custom: true, kanjiIds: JLPT['JLPT-5'] }
  ]

  static async loadGroups() {
    const allKanjies = await Kanji.loadAllKanjies()
    console.log('allKanjies', allKanjies)
    let groups = await cacheDb.getGroups()

    if (!groups.length) {
      groups = await KanjiGroup.createGroups()
      cacheDb.putAllGroups(groups)
    }
    groups = groups.sort(sortGroups)
    return groups.map(data => new KanjiGroup(data, allKanjies))
  }

  static async createGroups() {
    const groups = []

    for (let i = 0; i < KanjiGroup.groupsConf.length; i++) {
      const conf = KanjiGroup.groupsConf[i]
      conf.label = capitalize(conf.id).replace('-', ' ')
      const group = Object.assign({}, conf, { label: capitalize(conf.id).replace('-', ' ') })
      if (!group.kanjiIds && group.id !== 'all') {
        const url = `${BASE_URL}/${KANJI_PATH}/${group.id}`
        try {
          const response = await fetch(url)
          group.kanjiIds = await response.json()
        } catch (e) {
          alert('Unable to load kanji')
        }
      }
      groups.push(group)
    }

    return groups
  }

  serailize() {
    return Object.keys(KanjiGroup.attrs).reduce((acc, key) => {
      acc[key] = this[key]
      return acc
    }, {})
  }

  materialize(data) {
    Object.keys(KanjiGroup.attrs).forEach(key => {
      this[key] = data[key] || KanjiGroup.attrs[key]
    })
  }

  fillKanjies(allKanjies) {
    this.kanjies = this.id === 'all'
      ? allKanjies
      : this.kanjiIds.map(sign => allKanjies.find(k => k.sign === sign))
  }

  constructor(data, allKanjies) {
    this.materialize(data)
    if (allKanjies) {
      this.fillKanjies(allKanjies)
    }
  }
}

export default KanjiGroup

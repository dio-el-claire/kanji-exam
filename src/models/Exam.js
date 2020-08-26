import cacheDb from '@/cacheDb'
import Kanji from '@/models/Kanji'
import { random } from 'lodash'

function filterReadings(value) {
  return value.indexOf('-') === -1
}

function filterMeanings(value) {
  return value.indexOf('(') === -1
}

export default class Exam {
  id = ''
  label = ''
  ready = false
  tickets = []

  async init(kanjies) {
    console.log('init', this.id, kanjies)
    const kanjiList = []

    await cacheDb.ready()

    for (let i = 0; i < kanjies.length; i++) {
      const data = await cacheDb.getKanji(kanjies[i])
      const kanji = new Kanji(data)
      if (!kanji.meanings.length) await kanji.load()
      kanjiList.push(kanji)
    }

    const ons = [...new Set(kanjiList.map(k => k.onReadings).flat().filter(filterReadings))]
    const kuns = [...new Set(kanjiList.map(k => k.kunReadings).flat().filter(filterReadings))]
    const meanings = [...new Set(kanjiList.map(k => k.meanings).flat().filter(filterMeanings))]
    console.log(ons.length)
    console.log(kuns)
    console.log(meanings)

    const allKanjies = await cacheDb.getAllKanjies()
    const qnt = kanjiList.length
    const start = random(0, allKanjies.length - qnt)
    console.log('start', start, qnt)

    const appendix = allKanjies.slice(start, start + qnt)
    console.log('appendix', appendix)
    const appendixList = []

    for (let i = 0; i < appendix.length; i++) {
      const kanji = new Kanji(appendix[i])
      if (!kanji.meanings.length) {
        await kanji.load()
      }
      appendixList.push(kanji)
    }
    console.log('appendixList', appendixList)
    const wrongOns = [...new Set(appendixList.map(k => k.onReadings).flat().filter(on => !ons.includes(on)))]
    const wrongKuns = [...new Set(appendixList.map(k => k.kunReadings).flat().filter(kun => !kuns.includes(kun)))]
    const wrongMeanings = [...new Set(appendixList.map(k => k.meanings).flat().filter(m => !meanings.includes(m)))]
    console.log('wrongOns', wrongOns)
    console.log('wrongKuns', wrongKuns)
    console.log('wrongMeanings', wrongMeanings)
  }

  constructor(config) {
    const { id, label, kanjies } = config
    Object.assign(this, { id, label })
    this.init(kanjies)
  }
}

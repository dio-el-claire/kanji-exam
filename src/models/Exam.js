import cacheDb from '@/cacheDb'
import store from '@/store'
import Kanji from '@/models/Kanji'
import ExamTicket from '@/models/ExamTicket'
import { random } from 'lodash'
import { filterReadings, filterMeanings } from '@/utils'

const uniqueKanjiesValues = (kanjies, type) => {
  const isMeanings = type === 'meanings'
  const attr = isMeanings ? type : `${type}Readings`
  const filter = isMeanings ? filterMeanings : filterReadings
  return [...new Set(kanjies.map(k => k[attr]).flat().filter(filter))]
}

export default class Exam {
  id = ''
  label = ''
  ready = false
  tickets = []
  currentTicket = null
  complete = false

  nextTicket() {
    let ndx
    if (!this.currentTicket) {
      ndx = 0
    } else {
      ndx = this.tickets.indexOf(this.currentTicket) + 1
    }
    if (this.tickets[ndx]) {
      this.currentTicket = this.tickets[ndx]
    } else {
      this.complete = true
      this.currentTicket = null
    }
  }

  async init(kanjies) {
    const kanjiList = []

    await cacheDb.ready()

    for (let i = 0; i < kanjies.length; i++) {
      const data = await cacheDb.getKanji(kanjies[i])
      const kanji = new Kanji(data)
      if (!kanji.meanings.length) await kanji.load()
      kanjiList.push(kanji)
    }

    const ons = uniqueKanjiesValues(kanjiList, 'on')
    const kuns = uniqueKanjiesValues(kanjiList, 'kun')
    const meanings = uniqueKanjiesValues(kanjiList, 'meanings')

    const kanjiesForQuestions = store.state.kanjiGroups.find(g => g.id === 'joyo').kanjies
    const total = kanjiesForQuestions.length
    const offset = kanjiList.length * 10
    const start = offset >= total ? 0 : random(0, total - offset)
    const appendix = kanjiesForQuestions.slice(start, start + offset)
    const appendixList = []

    for (let i = 0; i < appendix.length; i++) {
      const kanji = new Kanji(appendix[i])
      if (!kanji.meanings.length) {
        // console.log('load', kanji.sign)
        await kanji.load()
      }
      appendixList.push(kanji)
    }

    const wrongAnswers = {
      ons: uniqueKanjiesValues(appendixList, 'on').filter(on => !ons.includes(on)),
      kuns: uniqueKanjiesValues(appendixList, 'kun').filter(on => !kuns.includes(on)),
      meanings: uniqueKanjiesValues(appendixList, 'meanings').filter(on => !meanings.includes(on))
    }

    this.tickets = ExamTicket.factory(kanjiList, wrongAnswers)
    this.ready = true
  }

  serialize() {
    const result = {
      currentNdx: this.currentTicket.number - 1,
      tickets: this.tickets.map(ticket => ticket.serialize()),
      wrongAnswers: ExamTicket.wrongAnswers
    }

    return result
  }

  constructor(config) {
    const { id, label, kanjies } = config
    Object.assign(this, { id, label })
    this.init(kanjies)
  }
}

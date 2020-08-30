import Vue from 'vue'
import store from '@/store'
import cacheDb from '@/cacheDb'
import Kanji from '@/models/Kanji'
import ExamTicket from '@/models/ExamTicket'
// import { random, range } from 'lodash'
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
  loadPercents = 0

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
    console.time('init')
    this.loadPercents = 10

    const delta = kanjies.length * 0.2
    for (let i = 0; i < kanjies.length; i++) {
      const data = await cacheDb.getKanji(kanjies[i])
      console.timeEnd('init')
      const kanji = new Kanji(data)
      kanjiList.push(kanji)
      this.loadPercents = Math.ceil(this.loadPercents + delta)
    }

    const kanjiAnswers = store.state.kanjiGroups.find(g => g.id === 'jlpt-4').kanjies
    this.loadPercents = 40
    const notLoadedKanji = kanjiList.concat(kanjiAnswers).filter(k => !k.meanings.length)
    console.log('notLoadedKanji', notLoadedKanji.length)

    const l = notLoadedKanji.length
    if (l) {
      const total = l + l * 0.6

      for (let i = 0; i < l; i++) {
        await notLoadedKanji[i].load()
        const percents = 40 + Math.floor((i * 100) / total)
        this.loadPercents = percents < 100 ? percents : 100
      }
    } else {
      this.loadPercents = 80
    }

    const allKanjies = kanjiList.concat(kanjiAnswers)
    const answers = {
      ons: uniqueKanjiesValues(allKanjies, 'on'),
      kuns: uniqueKanjiesValues(allKanjies, 'kun'),
      meanings: uniqueKanjiesValues(allKanjies, 'meanings')
    }

    this.loadPercents = 100
    this.tickets = ExamTicket.factory(kanjiList, answers)
    this.nextTicket()
    this.ready = true
  }

  serialize() {
    const result = {
      ticketNumber: this.currentTicket.number,
      tickets: this.tickets.map(ticket => ticket.serialize()),
      answers: ExamTicket.answers
    }

    return result
  }

  constructor(config) {
    const { id, label, kanjies } = config
    Object.assign(this, { id, label })
    this.loadPercents = 5
    if (store.state.kanjiGroups.length) {
      this.init(kanjies)
    } else {
      const self = this
      this.vm = new Vue({
        created() {
          this.$watch(() => store.state.kanjiGroups, (value) => {
            console.log('groups', value)
            self.init(kanjies)
          })
        }
      })
    }
  }
}

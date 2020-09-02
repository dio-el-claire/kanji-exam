import Vue from 'vue'
import store from '@/store'
import cacheDb from '@/cacheDb'
import Kanji from '@/models/Kanji'
import ExamTicket from '@/models/ExamTicket'
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
      store.dispatch('CLEAR_EXAM')
      store.dispatch('SAVE_STAT', this.getStat())
    }
  }

  async init(kanjies) {
    const kanjiList = []
    this.loadPercents = 10

    const delta = kanjies.length * 0.2
    for (let i = 0; i < kanjies.length; i++) {
      const data = await cacheDb.getKanji(kanjies[i])
      const kanji = new Kanji(data)
      kanjiList.push(kanji)
      this.loadPercents = Math.ceil(this.loadPercents + delta)
    }

    const answersLoaded = !!ExamTicket.answers.ons.length
    const kanjiAnswers = answersLoaded
      ? []
      : store.state.kanjiGroups.find(g => g.id === 'jlpt-4').kanjies
    this.loadPercents = 40
    const notLoadedKanji = kanjiList
      .concat(kanjiAnswers)
      .filter(k => !k.meanings.length)

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

    let answers
    if (!answersLoaded) {
      const allKanjies = kanjiList.concat(kanjiAnswers)
      answers = {
        ons: uniqueKanjiesValues(allKanjies, 'on'),
        kuns: uniqueKanjiesValues(allKanjies, 'kun'),
        meanings: uniqueKanjiesValues(allKanjies, 'meanings')
      }
    }

    this.loadPercents = 100
    this.tickets = ExamTicket.factory(kanjiList, answers)
    this.nextTicket()
    this.ready = true
  }

  serialize() {
    const { id, label, currentTicket: { number }, ready, complete } = this
    const result = {
      id,
      label,
      number,
      ready,
      complete,
      tickets: this.tickets.map(ticket => ticket.serialize()),
      answers: ExamTicket.answers
    }

    return result
  }

  materialize(data) {
    const {
      id,
      label,
      number,
      tickets,
      answers
    } = data

    this.loadPercents = 50
    Object.assign(this, { id, label })
    if (answers) ExamTicket.answers = answers
    this.tickets = ExamTicket.restore(tickets)
    this.currentTicket = this.tickets.find(t => t.number === number)
    this.ready = true
    return this
  }

  getStat() {
    const { id, label } = this
    return {
      id,
      label,
      date: (new Date()).toISOString(),
      kanjies: this.tickets.map(t => t.getStat())
    }
  }

  constructor(config, dump) {
    this.loadPercents = 5

    if (dump) {
      return this.materialize(dump)
    }
    const { id, label, kanjies } = config
    Object.assign(this, { id, label })

    if (store.state.kanjiGroups.length) {
      this.init(kanjies)
    } else {
      const self = this
      this.vm = new Vue({
        created() {
          this.$watch(() => store.state.kanjiGroups, (value) => {
            self.init(kanjies)
          })
        }
      })
    }
  }
}

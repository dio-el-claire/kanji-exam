import { random } from 'lodash'
import { shuffleArray, filterReadings, filterMeanings } from '@/utils'
import Kanji from '@/models/Kanji'

const MIN_ADD_VALUES = 5
const MAX_ADD_VALUES = 10
const NO_VALUE_CHANCE = 20

export default class ExamTicket {
  static answers = {
    ons: [],
    kuns: [],
    meanings: []
  }

  static factory(kanjies, answers) {
    if (answers) {
      ExamTicket.answers = answers
    }
    return kanjies.map((kanji, i) => new ExamTicket(kanji, i + 1))
  }

  static restore(dump) {
    return dump.map(data => new ExamTicket(null, null, data))
  }

  static createVariants(values, type) {
    const answers = ExamTicket.answers[type]
    const offset = random(MIN_ADD_VALUES, Math.max(MAX_ADD_VALUES, values.length))
    const start = random(0, answers.length - offset)
    const valid = values.filter(type === 'meanings' ? filterMeanings : filterReadings).map(ExamTicket.createValidVariant)
    const invalid = answers.filter(a => !valid.includes(a)).slice(start, start + offset).map(ExamTicket.createInvalidVariant)
    const variants = shuffleArray(valid.concat(invalid))
    if (!valid.length || (type !== 'meanings' && random(0, 100) > 100 - NO_VALUE_CHANCE)) {
      variants.push(ExamTicket.createVariant('no value', !valid.length))
    }
    return variants
  }

  static createValidVariant(value) {
    return ExamTicket.createVariant(value, true)
  }

  static createInvalidVariant(value) {
    return ExamTicket.createVariant(value, false)
  }

  static createVariant(value, isCorrect) {
    return {
      value,
      isCorrect,
      isValid: null
    }
  }

  validate() {
    const questions = this.questions
    const { ons, kuns, meanings } = questions
    Object.keys(questions).forEach(key => {
      this.validateType(questions[key], this.answers[key])
    })
    this.complete = true

    this.isValid = ![ons, kuns, meanings].flat().some(v => v.isValid === false)
  }

  validateType(questions, answers) {
    questions.forEach(q => {
      if (q.isCorrect) {
        q.isValid = answers.includes(q.value)
      } else if (answers.includes(q.value)) {
        q.isValid = false
      }
    })
  }

  serialize() {
    const { kanji, questions, answers, number, complete, isValid } = this
    return {
      kanji: kanji.serialize(),
      questions,
      answers,
      number,
      complete,
      isValid
    }
  }

  materialize(data) {
    Object.assign(this, data)
    this.kanji = new Kanji(this.kanji)
    return this
  }

  getStat() {
    return {
      kanji: this.kanji.sign,
      results: {
        ons: {
          success: this.questions.ons.filter(q => q.isValid).map(q => q.value),
          failed: this.questions.ons.filter(q => q.isValid === false).map(q => q.value)
        },
        kuns: {
          success: this.questions.kuns.filter(q => q.isValid).map(q => q.value),
          failed: this.questions.kuns.filter(q => q.isValid === false).map(q => q.value)
        },
        meanings: {
          success: this.questions.meanings.filter(q => q.isValid).map(q => q.value),
          failed: this.questions.meanings.filter(q => q.isValid === false).map(q => q.value)
        }
      }
    }
  }

  constructor(kanji, number, dump) {
    if (dump) {
      return this.materialize(dump)
    }
    this.kanji = kanji
    this.number = number
    this.complete = false
    this.isValid = undefined
    this.questions = {
      ons: ExamTicket.createVariants(kanji.onReadings, 'ons'),
      kuns: ExamTicket.createVariants(kanji.kunReadings, 'kuns'),
      meanings: ExamTicket.createVariants(kanji.meanings, 'meanings')
    }

    this.answers = {
      ons: [],
      kuns: [],
      meanings: []
    }
  }
}

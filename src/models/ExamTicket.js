import { random } from 'lodash'
import { shuffleArray, filterReadings, filterMeanings } from '@/utils'
import Kanji from '@/models/Kanji'

const NO_VALUE_CHANCE = 100

export default class ExamTicket {
  static wrongAnswers = {
    ons: [],
    kuns: [],
    meanings: []
  }

  static factory(kanjies, wrongAnswers) {
    ExamTicket.wrongAnswers = wrongAnswers
    console.log(wrongAnswers)
    return kanjies.map((kanji, i) => new ExamTicket(kanji, i + 1))
  }

  static createVariants(values, type) {
    const wrongAnswers = ExamTicket.wrongAnswers[type]
    const offset = random(4, Math.max(8, values.length))
    const start = random(0, wrongAnswers.length - offset)
    const valid = values.filter(type === 'meanings' ? filterMeanings : filterReadings).map(ExamTicket.createValidVariant)
    const invalid = wrongAnswers.slice(start, start + offset).map(ExamTicket.createInvalidVariant)
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
    const { kanji, questions, answers, number } = this
    return {
      kanji: kanji.serialize(),
      questions,
      answers,
      number
    }
  }

  materialize(data) {
    Object.assign(this, data)
    this.kanji = new Kanji(this.kanji)
  }

  constructor(kanji, number) {
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

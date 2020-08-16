import { camelCase } from 'lodash'

export default class Kanji {
  sign = ''
  grade = null
  meanings = []
  kunReadings = []
  onReadings = []
  nameReadings = []
  jlpt = null
  strokeCount = null
  unicode = null

  attrs = ['sign', 'grade', 'meanings', 'kun_readings', 'on_readings', 'name_readings', 'jlpt', 'stroke_count', 'unicode']

  serialize () {
    return this.attrs.reduce((acc, key) => {
      acc[key] = this[camelCase(key)]
      return acc
    }, {})
  }

  materialize (data) {
    this.attrs.forEach(key => {
      this[camelCase(key)] = data[key]
    })
  }

  constructor (sign) {
    this.sign = sign
  }
}

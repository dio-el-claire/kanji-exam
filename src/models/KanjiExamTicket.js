import { randomInteger, shuffleArray, SANITAIZERS, FILTERS } from '../utils';
import KanjiStat from './KanjiStat';

const createVariant = (val, isCorrect) => {
  return {
    text: val,
    value: val,
    isCorrect,
    isValid: undefined
  };
};

const createCorrectVariant = val => createVariant(val, true);
const createIncorrectVariant = val => createVariant(val, false);

export default class KanjiExamTicket {
  kanji = null;
  static variants = [];
  questions = [];
  complete = false;

  constructor(kanji) {
    this.kanji = kanji;
    this.init();
  }

  async init() {
    await this.kanji.load();

    ['on', 'kun', 'meanings'].forEach(name => {
      const values = this.kanji[name === 'meanings' ? name : `${name}_readings`];
      const label = name === 'meanings' ? name.toUpperCase() : `${name.toUpperCase()} reading`;
      this.questions.push({
        name,
        label,
        options: this.getVariants(name, values),
        selected: []
      })
    });

  }

  getVariants(type, source) {
    const correct = source.filter(FILTERS[type]).map(SANITAIZERS[type]);
    const correctVariants = correct.map(createCorrectVariant);
    const incorrectVariants = this.getIncorrect(type, correct);
    const variants = shuffleArray(correctVariants.concat(incorrectVariants));

    if (type !== 'meanings' && (!correct.length || randomInteger(1, 5) > 4)) {
      variants.push({
        text: `no ${type} reading`,
        value: null,
        isCorrect: !correct.length,
        isValid: undefined
      });
    }

    return variants;
  }

  getIncorrect(type, correct) {
    return KanjiExamTicket.variants[type]
      .filter(val => !correct.includes(val))
      .slice(0, correct.length + randomInteger(1, 5)).map(createIncorrectVariant);
  }

  validate() {
    this.questions.forEach(KanjiExamTicket.validateQuestion);

    this.complete = true;
  }

  static validateQuestion(question) {
    let selected = question.selected;
    question.options.forEach(r => {
      let sel = selected.includes(r.value);
      if (r.isCorrect) {
        r.isValid = sel;
      } else if (sel) {
        r.isValid = false;
      }
    });
  }

  getStat() {
    const data = this.questions.map(q => {
      const total = q.options.filter(o => o.isValid !== undefined);
      const valid = total.filter(o => o.isValid);
      return {
        name: q.name,
        total: total.length,
        valid: valid.length
      }
    });
    console.log(data)
    return new KanjiStat(data)
    // console.log(this.kunReadings)
    // const stat = ['on', 'kun', 'meanings'].map(type => {
    //
    // })
    // let selected = this.onReadings.options.filter(o => o.isValid !== undefined);
    // let valid = selected.filter(o => o.isValid);
    // let res = Math.ceil((valid.length * 100)/selected.length);
    // console.log(selected, valid, res)
    // return res
  }
}

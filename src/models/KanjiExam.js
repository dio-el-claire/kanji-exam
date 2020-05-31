import kanjiCollection from './KanjiCollection';

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

const VARIANTS_LENGTH = 100;

const SANITAIZERS = {
  on: val => val.replace('.', ''),
  kun: val => val.replace('.', ''),
  meanings: val => val
};

const FILTERS = {
  on: val => val,
  kun: val => val.indexOf('-') == -1,
  meanings: val => val.indexOf('.') === - 1
};

const createVariant = (val, isCorrect) => {
  return {
    text: val,
    value: val,
    isCorrect,
    isValid: undefined
  };
};

const createValidVariant = val => createVariant(val, true);
const createInValidVariant = val => createVariant(val, false);

class KanjiExamTicket {
  kanji = null;
  static variants = [];
  kunReadings = {selected: [], options: []};
  onReadings = {selected: [], options: []};
  meanings = {selected: [], options: []};
  complete = false;

  constructor(kanji) {
    this.kanji = kanji;
    this.init();
  }

  async init() {
    await this.kanji.load();
    const { kun_readings, on_readings, meanings } = this.kanji;
    this.kunReadings.options = this.getVariants('kun', kun_readings);
    this.onReadings.options = this.getVariants('on', on_readings);
    this.meanings.options = this.getVariants('meanings', meanings);
  }

  getVariants(type, source) {
    const correct = source.filter(FILTERS[type]).map(SANITAIZERS[type]);
    let variants = correct.map(createValidVariant);

    variants = shuffleArray(variants.concat(this.getIncorrect(type, correct)));

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
      .slice(0, correct.length + randomInteger(1, 5)).map(createInValidVariant);
  }

  validate() {
    this.validateType(this.kunReadings);
    this.validateType(this.onReadings);
    this.validateType(this.meanings);
    this.complete = true;
  }

  validateType(type) {
    let selected = type.selected;
    type.options.forEach(r => {
      let sel = selected.includes(r.value);
      if (r.isCorrect) {
        r.isValid = sel;
      } else if (sel) {
        r.isValid = false;
      }
    });
  }
}

export default class KanjiExam {
  group = null;
  ticket = null;
  ready = false;
  variants = {};
  history = [];

  constructor(group) {
    this.group = group;
    this.init();
  }

  async init() {
    // await this.group.load();
    let kanjies = kanjiCollection.groups['jinmeiyo'].models;

    let min = randomInteger(0, kanjies.length - 1);
    let max;
    if (min + VARIANTS_LENGTH > kanjies.length - 1) {
      max = min;
      min = max - VARIANTS_LENGTH;
    } else {
      max = min + VARIANTS_LENGTH;
    }
    const variants = kanjies.slice(min, max);

    await Promise.all(variants.map(kanji => kanji.load()));

    const ons = variants.reduce((acc, k) => acc.concat(k.on_readings), []);
    const kuns = variants.reduce((acc, k) => acc.concat(k.kun_readings), []);
    const meanings = variants.reduce((acc, k) => acc.concat(k.meanings), []);

    KanjiExamTicket.variants = {
      on: [...new Set(ons)],
      kun: [...new Set(kuns)].filter(FILTERS.kun).map(SANITAIZERS.kun),
      meanings: [...new Set(meanings)].filter(FILTERS.meanings)
    };

    this.next();
    this.ready = true;
  }

  next() {
    const ndx = this.ticket ? this.group.indexOf(this.ticket.kanji) + 1 : 0;

    if (ndx < this.group.models.length) {
      this.ticket = new KanjiExamTicket(this.group.models[ndx]);
    }
  }

  completeTicket() {
    this.ticket.validate();
    this.history.push(this.ticket);
    if (this.group.indexOf(this.ticket.kanji) === this.group.count - 1) {
      this.ticket = null;
      this.complete = true;
    }
    console.log(this.history)
  }
}

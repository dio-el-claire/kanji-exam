import kanjiCollection from './KanjiCollection';
import { shuffleArray, SANITAIZERS, FILTERS } from '../utils';
import KanjiExamTicket from './KanjiExamTicket';
import ExamStat from './ExamStat';

export default class KanjiExam {
  groupId = '';
  group = null;
  ticket = null;
  ready = false;
  variants = {};
  history = [];
  stat = null;
  complete = false;
  #promise = null;

  constructor(groupId) {
    this.groupId = groupId;
    this.init();
  }

  async init() {
    if (this.#promise) {
      return this.#promise;
    }
    await kanjiCollection.init();
    this.group = kanjiCollection.groups.find(g => g.label === this.groupId);
    const kanjies = kanjiCollection.groups.find(g => g.label === 'jinmeiyo').models;
    const variants = shuffleArray(kanjies).slice(0, 100);
    await Promise.all(kanjies.map(kanji => kanji.load()));

    const ons = variants.reduce((acc, k) => acc.concat(k.on_readings), []);
    const kuns = variants.reduce((acc, k) => acc.concat(k.kun_readings), []);
    const meanings = variants.reduce((acc, k) => acc.concat(k.meanings), []);
    KanjiExamTicket.variants = {
      on: [...new Set(ons)],
      kun: [...new Set(kuns)].filter(FILTERS.kun).map(SANITAIZERS.kun),
      meanings: [...new Set(meanings)].filter(FILTERS.meanings)
    };

    this.next();
  }

  next() {
    const ndx = this.ticket ? this.group.indexOf(this.ticket.kanji) + 1 : 0;

    if (ndx < this.group.models.length) {
      this.ticket = new KanjiExamTicket(this.group.models[ndx]);
      if (ndx === this.group.models.length - 1) {
        this.ticket.isLast = true;
      }
    }
  }

  completeTicket() {
    this.ticket.validate();
    this.history.push(this.ticket.getStat());
    console.log(this.history)
  }

  createStat() {
    this.ticket = null;
    this.complete = true;
    this.stat = new ExamStat(this.history);
    console.log(this.stat)
  }
}

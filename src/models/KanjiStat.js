export default class KanjiStat {
  details = [];
  counts = {
    passed: 0,
    failed: 0
  };
  percents = {
    passed: 0,
    failed: 0
  };

  constructor(stats = []) {
    this.details = stats.map(stat => {
      const { name, total, valid } = stat;

      this.counts.passed += valid;
      this.counts.failed += total - valid;

      const percent = Math.ceil((valid * 100)/total);
      return {
        name, total, valid,
        percents: {
          passed: percent,
          failed: 100 - percent
        }
      }
    });

    this.percents.passed = Math.ceil((this.counts.passed * 100) / (this.counts.passed + this.counts.failed));
    this.percents.failed = 100 - this.percents.passed;
  }


}

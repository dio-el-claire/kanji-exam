export default class ExamStat {
  stats = [];
  counts = {
    passed: 0,
    failed: 0
  };
  percents = {
    passed: 0,
    failed: 0
  };

  constructor(stats) {
    this.stats = stats;
    this.counts = stats.reduce((acc, stat) => {
      acc.passed += stat.counts.passed;
      acc.failed += stat.counts.failed;
      return acc;
    }, { passed: 0, failed: 0 });
    this.percents.passed = Math.ceil((this.counts.passed * 100) / (this.counts.passed + this.counts.failed));
    this.percents.failed = 100 - this.percents.passed;
  }
}

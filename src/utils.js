const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1])

const filterReadings = value => value && value.indexOf('-') === -1

const filterMeanings = value => value.indexOf('(') === -1

export { shuffleArray, filterReadings, filterMeanings }

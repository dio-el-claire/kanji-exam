export function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);

export const SANITAIZERS = {
  on: val => val.replace('.', ''),
  kun: val => val.replace('.', ''),
  meanings: val => val
};

export const FILTERS = {
  on: val => val.indexOf('-') === -1,
  kun: val => val.indexOf('-') === -1,
  meanings: val => val.indexOf('.') === - 1
};

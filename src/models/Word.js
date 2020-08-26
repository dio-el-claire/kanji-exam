export default class Word {
  written = ''
  pronounced = ''
  meanings = ''

  constructor(data = {}) {
    const { variants, meanings } = data

    if (!(variants && meanings)) return

    const variant = variants[0]
    this.written = variant.written
    this.pronounced = variant.pronounced
    this.meanings = meanings.map(m => m.glosses).flat()
  }
}

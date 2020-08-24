import cacheDb from '@/cacheDb'
import { capitalize } from 'lodash'
import { BASE_URL, KANJI_PATH, JLPT } from '@/config'

async function loadKanjies () {
  await cacheDb.ready()
  let kanjies = await cacheDb.getAllKanjies()
  if (!kanjies.length) {
    const url = `${BASE_URL}/${KANJI_PATH}/all`
    try {
      const response = await fetch(url)
      const signs = await response.json()

      kanjies = signs.map(sign => createKanji(sign))
      cacheDb.putAllKanjies(kanjies)
    } catch (e) {
      alert(e.message)
    }
  }
  return kanjies
}

async function loadKanjiGroups () {
  const kanjies = await loadKanjies()
  let groups = await cacheDb.getGroups()

  if (!groups.length) {
    groups = await createGroups()
    cacheDb.putAllGroups(groups)
  }

  groups.forEach(g => {
    g.kanjies = g.id === 'all'
      ? kanjies
      : kanjies.filter(k => g.kanjiIds.includes(k.sign))
  })
  return groups
}

function createKanji (sign) {
  return {
    sign,
    grade: '',
    meanings: [],
    kunReadings: [],
    onReadings: [],
    nameReadings: [],
    jlpt: null,
    strokeCount: null,
    unicode: null
  }
}

async function createGroups () {
  const grades = [...Array(8).keys()].map(i => `grade-${i + 1}`)
  grades.splice(6, 1)
  const jlpt = [...Array(5).keys()].map(i => `jlpt-${i + 1}`)
  const others = ['joyo', 'jinmeiyo', 'all']
  const groups = grades.concat(jlpt).concat(others).map((id) => {
    return {
      id,
      label: capitalize(id).replace('-', ' '),
      custom: false,
      kanjies: []
    }
  })
  for (var i = 0; i < groups.length; i++) {
    groups[i].kanjiIds = await getKanjiIds(groups[i].id)
  }
  return groups
}

async function getKanjiIds (groupId) {
  let kanjiIds

  if (groupId.indexOf('jlpt') === 0) {
    kanjiIds = JLPT[groupId.toUpperCase()]
  } else if (groupId !== 'all') {
    const url = `${BASE_URL}/${KANJI_PATH}/${groupId}`
    try {
      const response = await fetch(url)
      kanjiIds = await response.json()
    } catch (e) {
      alert(e.message)
    }
  }
  return kanjiIds
}

export { loadKanjiGroups }
